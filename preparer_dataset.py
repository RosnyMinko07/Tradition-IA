"""
TRADITION IA — Script de génération du Dataset d'entraînement (JSONL)
Auteur : Rosny OTSINA
Ce script extrait les phrases, proverbes et dictionnaires existants de Tradition IA
et génère un fichier 'dataset_tradition_ia.jsonl' prêt pour le Fine-Tuning.
"""

import json
import re
import os

SYSTEM_PROMPT = (
    "Tu es Mbolo IA, l'intelligence artificielle experte des 9 langues et traditions "
    "du Gabon (Fang, Punu, Myènè, Nzébi, Téké, Vili, Obamba, Guisir, Kota), créée par Rosny OTSINA "
    "pour la plateforme Tradition IA. Tu réponds avec précision, bienveillance et authenticité culturelle."
)

EXEMPLES_BASE = [
    # Salutations & Politesse
    ("Comment dit-on 'Bonjour' dans les langues du Gabon ?",
     "Dans presque toutes les langues du Gabon (Fang, Punu, Myènè, Nzébi, Téké, Vili, Kota, Guisir, Obamba), la salutation universelle et sacrée est 'Mbolo' !"),

    ("Comment dit-on 'Merci' en Fang, Punu et Myènè ?",
     "Voici les traductions de 'Merci' :\n- En Fang : 'Akiba'\n- En Punu : 'Yine'\n- En Myènè : 'Ogula'\n- En Nzébi : 'Ayé'\n- En Téké : 'Nzala'\n- En Kota : 'Mbenge'"),

    ("Comment dit-on 'Merci beaucoup' en Fang ?",
     "En Fang, 'Merci beaucoup' se dit : 'Akiba mi neng'."),

    ("Comment dire 'Au revoir' en Fang et en Punu ?",
     "Pour prendre congé :\n- En Fang : 'Oké bia'\n- En Punu : 'Mbote moke'\n- En Myènè : 'Ogenda wé'"),

    # Vie quotidienne & Besoins
    ("Traduis en Fang : 'Je vais au marché.'",
     "En Fang : 'Ma ke mabè.' ('Ma ke' = je vais, 'mabè' = le marché)."),

    ("Traduis en Punu : 'Je vais au marché.'",
     "En Punu : 'Nda enda nsanda.' ('Nda enda' = je vais, 'nsanda' = le marché)."),

    ("Traduis en Myènè : 'Je vais au marché.'",
     "En Myènè : 'Nda enda nsanda.'"),

    ("Comment dit-on 'L'eau est froide' en Fang, Punu et Myènè ?",
     "- En Fang : 'Owusu a wum.'\n- En Punu : 'Medzi i tama.'\n- En Myènè : 'Ino o tama.'"),

    ("Comment dit-on 'J'ai faim' en langue Punu et en Fang ?",
     "En Punu, 'J'ai faim' se dit : 'Nzala mi bula.' (la faim me frappe). En Fang, on dit : 'Ma zim nkuan.'"),

    ("Comment dit-on 'J'ai soif' en Fang et en Myènè ?",
     "- En Fang : 'Ma nom owusu.'\n- En Myènè : 'Ino e njika me.'"),

    ("Comment dit-on 'Combien coûte ceci ?' en Fang et en Punu ?",
     "Pour demander le prix au marché :\n- En Fang : 'Mbot ke ngé ?'\n- En Punu : 'Mutengo ke bueni ?'\n- En Myènè : 'Ntemo ke bwè ?'"),

    ("Traduis 'Je ne comprends pas' en Fang.",
     "En Fang, 'Je ne comprends pas' se dit : 'Ma wom yago.' (En Punu : 'Ka ndi wona ko.')."),

    ("Comment demander 'Comment tu t'appelles ?' en Fang ?",
     "En Fang, on demande : 'O tô dzé ?'. Pour répondre 'Je m'appelle [nom]', on dit : 'Ma tô [nom]'."),

    ("Comment dit-on 'D'où viens-tu ?' et 'Je viens du Gabon' en Fang ?",
     "- 'D'où viens-tu ?' : 'O ba va ?'\n- 'Je viens du Gabon' : 'Ma ba Gabon.'"),

    ("Traduis 'Le fleuve Ogooué est majestueux' en Fang et en Punu.",
     "- En Fang : 'Nzé Ogooué a be nkumo.'\n- En Punu : 'Ngove Ogooué i kolo.'\n- En Myènè : 'Ogooué o kolo.'"),

    # Proverbes traditionnels
    ("Donne-moi un proverbe gabonais sur la solidarité.",
     "Voici un proverbe majeur :\n- En Fang : 'Mone fok a ke bian, bone bele ba ke nkumo.'\n- En Punu : 'Mwana mosi o enda mbebo, bana bale ba enda mosika.'\nTraduction : 'Seul on va plus vite, ensemble on va plus loin.' Ce proverbe met en valeur l'entraide communautaire."),

    ("Donne-moi le proverbe fang sur la forêt avec son explication.",
     "Le proverbe fang dit : 'Afan a we mam ma ye, kono a bo ye wa ba wom.'\nTraduction : 'La forêt cache ses secrets mais les parle à ceux qui savent écouter.'\nSens : La forêt équatoriale est un temple de sagesse et d'écoute intérieure."),

    ("Que signifie le proverbe : 'Nkogo fok a ke afan' ?",
     "'Nkogo fok a ke afan' est un proverbe Fang qui signifie : 'Un seul arbre ne fait pas la forêt'. En Punu, on dit 'Nkosi yimosi i kaka ngira'. Il enseigne l'importance de l'unité et de la fraternité."),

    ("Que signifie 'Ñgàn a bo yago, nlem a ne ye' en Fang ?",
     "Ce proverbe Fang signifie : 'Ce que la bouche ne dit pas, le cœur le ressent'. Il souligne la puissance de l'empathie et des sentiments profonds."),

    # ── Données Fang authentiques (txt.txt) ──────────────────────
    # 1. Compter en Fang
    ("Comment compte-t-on de 0 à 10 en Fang ?",
     "Voici les chiffres de 0 à 10 en Fang :\n- 0 : zeze\n- 1 : fog (ou fok)\n- 2 : bê\n- 3 : lal\n- 4 : nî\n- 5 : tan\n- 6 : saman\n- 7 : zanbgwal\n- 8 : môôm\n- 9 : ébul\n- 10 : awôm"),

    ("Comment forme-t-on les dizaines et 100 en Fang ?",
     "En Fang, les dizaines se forment avec le préfixe 'mewôm' :\n- 20 : mewôm mebê\n- 30 : mewôm melal\n- 40 : mewôm menî\n- 50 : mewôm metan\n- 60 : mewôm mesaman\n- 70 : mewôm zanbgwal\n- 80 : mewôm môôm\n- 90 : mewôm ébul\n- 100 : ntet (ou nkama).\nPour les unités intermédiaires, on ajoute 'ye' (ex: 11 = awôm ye fog, 21 = mewôm mebê ye fog)."),

    # 2. La négation en Fang
    ("Comment exprimer 'Je n'ai pas...' en Fang ?",
     "En Fang, la négation dépend du sens :\n1. Possession / État : avec 'Me bele ki' (ex: 'Me bele ki Eyong' = Je n'ai pas le temps, 'Me bele ki miang' = Je n'ai pas d'argent).\n2. Passé (actions non faites) : avec l'auxiliaire 'dzi' (ex: 'Me dzi yene' = Je n'ai pas vu, 'Me dzi wok' = Je n'ai pas entendu, 'Me dzi dzi' = Je n'ai pas mangé, 'Me dzi bee' = Je n'ai pas compris).\n3. Capacité / Volonté : 'Ma se ki bo' (Je ne peux pas faire), 'Maa yi ki' (Je n'ai pas besoin), 'Ma wok ki zon' (Je n'ai pas faim)."),

    ("Traduis en Fang : 'Je n'ai pas d'argent' et 'Je n'ai pas le temps.'",
     "- 'Je n'ai pas d'argent' : 'Me bele ki miang.'\n- 'Je n'ai pas le temps' : 'Me bele ki Eyong.'"),

    ("Traduis en Fang : 'Je n'ai pas mangé', 'Je n'ai pas vu' et 'Je n'ai pas compris.'",
     "- 'Je n'ai pas mangé' : 'Me dzi dzi.'\n- 'Je n'ai pas vu' : 'Me dzi yene.'\n- 'Je n'ai pas compris' : 'Me dzi bee.'"),

    # 3. L'impératif négatif (Défense / Interdiction)
    ("Comment formule-t-on un ordre négatif ou une interdiction en Fang ?",
     "En Fang, l'impératif négatif se construit avec 'Ô tagha a + verbe' (ou 'Ô tagha m'a + verbe' quand cela concerne la 1ère personne 'moi') :\n- 'Ne parle pas' : 'Ô tagha a kobe'\n- 'Ne pars pas' : 'Ô tagha a ke'\n- 'Ne mange pas' : 'Ô tagha a dzi'\n- 'Ne viens pas' : 'Ô tagha a zu'\n- 'Ne m'embête pas' : 'Ô tagha m'a ndeghele'\n- 'Ne me provoque pas' : 'Ô tagha m'a song'\n- 'Ne m'insulte pas' : 'Ô tagha m'a tà'"),

    # 4. Dialogue de présentation et famille
    ("Donne-moi des phrases de présentation familiale en Fang.",
     "Voici des exemples courants :\n- 'Voici mon enfant' : 'Émo wom ényenyi.'\n- 'Comment s'appelle-t-il ?' : 'A n'éwula ya ?'\n- 'Il s'appelle Obiang' : 'A n'éwula nâ Obiang.'\n- 'Il a quel âge ?' : 'A bele mimbu tang ?'\n- 'Il a cinq ans' : 'A bele mimbu mitan.'\n- 'Tu as combien de frères ?' : 'Ô bele monenyang tang ya ?'\n- 'J'ai deux frères' : 'Me bele bobenyang bebegn.'"),

    # 5. Volonté et besoins quotidiens
    ("Comment dire ce que l'on veut en Fang ('Je veux manger', 'Je veux dormir') ?",
     "Pour exprimer la volonté, on utilise 'Ma kume' ou 'Ma kum'a + verbe' :\n- 'Je veux manger' : 'Ma kum'a dzi.'\n- 'Je veux boire' : 'Ma kum'a nyu.'\n- 'Je veux venir' : 'Ma kum'a nzu.'\n- 'Je veux dormir' : 'Ma kume koyoh.'\n- 'Je veux partir' : 'Ma kume ke.'\n- 'Je veux danser' : 'Ma kum'a dzem.'"),

    # 6. Expressions familières Fang
    ("Comment dit-on 'Fiche-moi la paix', 'Ça m'est égal' et 'Exactement' en Fang ?",
     "Voici ces expressions courantes :\n- 'Fiche-moi la paix' : 'Korgh me mïs.'\n- 'Ça m'est égal' : 'Maa bïs.'\n- 'Exactement' : 'Dza feh.'\n- 'Laisse-moi' : 'Zame mah.'\n- 'Je parle le fang' : 'Ma kobe fang.'"),

    # Culture, Masques & Développeur
    ("Quels sont les grands masques traditionnels du Gabon ?",
     "Le Gabon possède un art rituel exceptionnel. Parmi les plus renommés :\n1. Le Mukudj (Punu) : Masque blanc au kaolin sculpté avec élégance, porté par des danseurs acrobates sur échasses.\n2. Le Ngil (Fang) : Grand masque blanc élancé à la face impassible, utilisé autrefois par la société régulatrice du Ngil.\n3. Les reliquaires Kota : Figures sculptées recouvertes de cuivre et de laiton gardant les ossements sacrés."),

    ("Qu'est-ce que le Mvet (ou Nvet) ?",
     "Le Mvet est à la fois l'instrument sacré (harpe-cithare en fût de bambou avec calebasses) et la grande épopée poétique et philosophique des Fang chantée par les maîtres bardes."),

    ("Qui a créé la plateforme Tradition IA ?",
     "La plateforme Tradition IA a été conçue et développée par Rosny OTSINA, développeur Full Stack freelance basé à Libreville, Gabon (contact : rodrigueotsina@gmail.com | GitHub : https://github.com/RosnyMinko07).")
]

def extraire_connaissances_js():
    """Extrait automatiquement toutes les entrées de DICTIONARY_DATA et PHRASES_DATA depuis api/_knowledge.js"""
    resultats = []
    knowledge_path = os.path.join(os.path.dirname(__file__), "api", "_knowledge.js")
    if not os.path.exists(knowledge_path):
        return resultats

    try:
        with open(knowledge_path, "r", encoding="utf-8") as f:
            contenu = f.read()

        # 1. Extraire les mots du dictionnaire
        pattern_dict = re.findall(
            r"\{\s*fr:\s*['\"]([^'\"]+)['\"],\s*fang:\s*['\"]([^'\"]+)['\"](?:,\s*punu:\s*['\"]([^'\"]+)['\"])?(?:,\s*myene:\s*['\"]([^'\"]+)['\"])?",
            contenu
        )
        for fr, fang, punu, myene in pattern_dict:
            rep = f"En langue Fang, '{fr}' se dit '{fang}'."
            if punu:
                rep += f" En Punu, on dit '{punu}'."
            if myene:
                rep += f" En Myènè, on dit '{myene}'."
            resultats.append((f"Comment dit-on '{fr}' en Fang ?", rep))
            resultats.append((f"Traduis '{fr}' en Fang.", f"En Fang : '{fang}'."))

        # 2. Extraire les phrases complètes de PHRASES_DATA
        pattern_phrases = re.findall(
            r"type:\s*['\"]phrase['\"],\s*fr:\s*['\"]([^'\"]+)['\"],\s*fang:\s*['\"]([^'\"]+)['\"]",
            contenu
        )
        for fr, fang in pattern_phrases:
            resultats.append((f"Comment dit-on '{fr}' en Fang ?", f"En Fang : '{fang}'."))
            resultats.append((f"Que signifie en français la phrase fang : '{fang}' ?", f"En français, cela signifie : '{fr}'."))

    except Exception as e:
        print(f"Extraction automatique partielle : {e}")

    return resultats

import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def main():
    fichier_sortie = "dataset_tradition_ia.jsonl"
    tous_exemples = list(EXEMPLES_BASE)

    extraits = extraire_connaissances_js()
    if extraits:
        tous_exemples.extend(extraits)

    lignes_ecrites = 0
    with open(fichier_sortie, "w", encoding="utf-8") as f:
        for question, reponse in tous_exemples:
            sample = {
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": question},
                    {"role": "assistant", "content": reponse}
                ]
            }
            f.write(json.dumps(sample, ensure_ascii=False) + "\n")
            lignes_ecrites += 1

    print("=" * 60)
    print("GENERATION DU DATASET TERMINEE")
    print(f"Fichier genere : {fichier_sortie}")
    print(f"Nombre d'exemples d'entrainement : {lignes_ecrites}")
    print("=" * 60)

if __name__ == "__main__":
    main()
