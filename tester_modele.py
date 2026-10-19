"""
TRADITION IA — Script de Test / Inférence du Modèle Entraîné
Auteur : Rosny OTSINA
Permet de poser des questions au modèle fine-tuné et de comparer ses réponses.
"""

import sys
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE_MODEL = "Qwen/Qwen2.5-7B-Instruct"
LORA_PATH = "./tradition_ia_modele_entraine"

def interroger_ia(question, model, tokenizer):
    messages = [
        {
            "role": "system",
            "content": "Tu es Mbolo IA, l'intelligence artificielle experte des 9 langues et traditions du Gabon créée par Rosny OTSINA pour la plateforme Tradition IA."
        },
        {"role": "user", "content": question}
    ]

    prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    inputs = tokenizer(prompt, return_tensors="pt").to(device)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=256,
            temperature=0.3,
            top_p=0.9
        )

    reponse = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
    return reponse.strip()

def main():
    print("=" * 60)
    print("TRADITION IA - TEST DU MODELE ENTRAINE")
    print(f"Modele de base : {BASE_MODEL}")
    print(f"Dossier LoRA   : {LORA_PATH}")
    print("=" * 60)

    try:
        print("Chargement du tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, trust_remote_code=True)
        
        print("Chargement du modele...")
        base_model = AutoModelForCausalLM.from_pretrained(
            BASE_MODEL,
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            device_map="auto" if torch.cuda.is_available() else "cpu"
        )

        model = PeftModel.from_pretrained(base_model, LORA_PATH)
        model.eval()
    except Exception as e:
        print(f"Erreur lors du chargement : {e}")
        print("Assurez-vous d'avoir lance l'entrainement au prealable avec 'entrainer_modele.py'.")
        sys.exit(1)

    questions_test = [
        "Comment dit-on 'Bonjour, comment vas-tu ?' en Fang ?",
        "Traduis en Punu : 'Je vais au marché.'",
        "Donne-moi un proverbe gabonais sur la solidarité et explique son sens.",
        "Qui est le créateur de Tradition IA ?"
    ]

    for q in questions_test:
        print("\n" + "-" * 50)
        print(f"Q: {q}")
        reponse = interroger_ia(q, model, tokenizer)
        print(f"R: {reponse}")

if __name__ == "__main__":
    main()
