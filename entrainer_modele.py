"""
TRADITION IA — Script d'Entraînement / Fine-Tuning LoRA (QLoRA)
Auteur : Rosny OTSINA
Prérequis :
  pip install torch transformers datasets trl peft bitsandbytes accelerate
"""

import os
import sys
import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

MODEL_ID = "Qwen/Qwen2.5-7B-Instruct"
OUTPUT_DIR = "./tradition_ia_modele_entraine"
DATASET_FILE = "dataset_tradition_ia.jsonl"

def main():
    if not os.path.exists(DATASET_FILE):
        print(f"Erreur : Le fichier '{DATASET_FILE}' est introuvable. Lancez d'abord : py preparer_dataset.py")
        sys.exit(1)

    print("=" * 60)
    print(f"TRADITION IA - DEMARRAGE DU FINE-TUNING")
    print(f"Modele de base : {MODEL_ID}")
    print(f"Dataset         : {DATASET_FILE}")
    print("=" * 60)

    # 1. Configuration 4-bit (QLoRA)
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16 if torch.cuda.is_available() and torch.cuda.is_bf16_supported() else torch.float16,
        bnb_4bit_use_double_quant=True,
    )

    # 2. Tokenizer & Modèle
    print("Telechargement / Chargement du tokenizer et du modele...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    device_map = "auto" if torch.cuda.is_available() else "cpu"
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        quantization_config=bnb_config if torch.cuda.is_available() else None,
        device_map=device_map,
        trust_remote_code=True
    )

    if torch.cuda.is_available():
        model = prepare_model_for_kbit_training(model)

    # 3. Configuration LoRA
    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM"
    )

    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    # 4. Chargement et formatage du dataset
    dataset = load_dataset("json", data_files=DATASET_FILE, split="train")

    def formater_prompts(batch):
        textes = []
        for conversation in batch["messages"]:
            texte_formate = tokenizer.apply_chat_template(
                conversation,
                tokenize=False,
                add_generation_prompt=False
            )
            textes.append(texte_formate)
        return {"text": textes}

    dataset = dataset.map(formater_prompts, batched=True)

    # 5. Arguments d'entraînement
    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        optim="paged_adamw_8bit" if torch.cuda.is_available() else "adamw_torch",
        learning_rate=2e-4,
        lr_scheduler_type="cosine",
        save_strategy="epoch",
        logging_steps=10,
        num_train_epochs=5,
        fp16=torch.cuda.is_available() and not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_available() and torch.cuda.is_bf16_supported(),
        report_to="none"
    )

    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        peft_config=lora_config,
        dataset_text_field="text",
        max_seq_length=1024,
        tokenizer=tokenizer,
        args=training_args
    )

    print("Entrainement en cours...")
    trainer.train()

    print(f"Sauvegarde dans {OUTPUT_DIR}...")
    trainer.model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    print("Entrainement termine avec succes !")

if __name__ == "__main__":
    main()
