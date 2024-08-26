import json
import re
from collections import Counter

# Funzione per leggere il file JSON
def leggi_file_json(percorso):
    with open(percorso, 'r', encoding='utf-8') as file:
        dati = json.load(file)
    return dati

# Funzione per estrarre e stampare le sequenze di dati
def estrai_informazioni(dati):
    if isinstance(dati, list):  # Verifica se i dati sono una lista
        for voce in dati:
            if isinstance(voce, dict):
                # Estrai e stampa il titolo
                titolo = voce.get('title', 'N/A')
                print(f'Titolo: {titolo}')
                
                # Estrai e stampa il link
                link = voce.get('link', 'N/A')
                print(f'Link: {link}')
                
                # Estrai e stampa i tags
                tags = voce.get('tags', [])
                print(f'Tags: {", ".join(tags)}')
                
                # Estrai e stampa la data di creazione
                data_creazione = voce.get('creation_date', 'N/A')
                print(f'Data di creazione: {data_creazione}')
                
                # Estrai e stampa il punteggio
                punteggio = voce.get('score', 'N/A')
                print(f'Punteggio: {punteggio}')
                
                # Estrai e stampa il corpo
                corpo = voce.get('body', 'N/A')
                print(f'Corpo: {corpo}')
                
                # Estrai e stampa le risposte
                risposte = voce.get('answers', [])
                if isinstance(risposte, list):
                    print('Risposte:')
                    for risposta in risposte:
                        if isinstance(risposta, dict):
                            corpo_risposta = risposta.get('body', 'N/A')
                            punteggio_risposta = risposta.get('score', 'N/A')
                            accettata = risposta.get('is_accepted', 'N/A')
                            print(f'  - Corpo della risposta: {corpo_risposta}')
                            print(f'  - Punteggio: {punteggio_risposta}')
                            print(f'  - Accettata: {accettata}')
                else:
                    print('  - Nessuna risposta disponibile')
                
                print('\n')
            else:
                print('Voce non è un dizionario')
    else:
        print('I dati letti non sono una lista')

# Funzione per estrarre sequenze di parole
def estrai_sequenze(parole, n):
    """
    Estrae tutte le sequenze di n parole da una lista di parole.
    """
    return [' '.join(parole[i:i+n]) for i in range(len(parole)-n+1)]

# Funzione per pulire il testo
def pulisci_testo(html_text):
    """
    Pulisce il testo rimuovendo i tag HTML e i caratteri non alfanumerici.
    """
    testo_pulito = re.sub(r'<[^>]+>', '', html_text)  # Rimuove i tag HTML
    testo_pulito = re.sub(r'[^\w\s]', '', testo_pulito)  # Rimuove caratteri non alfanumerici
    testo_pulito = testo_pulito.lower()  # Converte il testo in minuscolo
    return testo_pulito

# Funzione per contare le sequenze di parole più comuni
def conta_sequenze_comuni(dati, n):
    """
    Conta le sequenze di n parole più comuni in un file JSON.
    """
    testo_completo = ""
    
    if isinstance(dati, list):
        for voce in dati:
            if isinstance(voce, dict):
                testo_completo += " " + voce.get("title", "")
                testo_completo += " " + voce.get("body", "")
                for risposta in voce.get("answers", []):
                    testo_completo += " " + risposta.get("body", "")
    else:
        print('I dati letti non sono una lista')

    # Pulisci e processa il testo
    testo_pulito = pulisci_testo(testo_completo)
    parole = testo_pulito.split()
    
    # Estrai le sequenze e conta la loro frequenza
    sequenze = estrai_sequenze(parole, n)
    contatore = Counter(sequenze)
    
    return dict(contatore.most_common())

# Funzione per salvare i risultati in un file di testo, filtrando per una parola chiave e frequenza
def salva_risultati(percorso_file_output, sequenze_due_parole, sequenze_tre_parole, parola_chiave, frequenza_minima):
    """
    Salva i risultati in un file di testo, filtrando le sequenze che contengono una parola chiave e hanno una frequenza minima.
    """
    with open(percorso_file_output, 'w', encoding='utf-8') as f:
        f.write(f"Sequenze di 2 parole che contengono '{parola_chiave}' e compaiono più di {frequenza_minima} volte:\n")
        for sequenza, conteggio in sequenze_due_parole.items():
            if parola_chiave in sequenza and conteggio > frequenza_minima:
                f.write(f"{sequenza}: {conteggio}\n")
        
        f.write(f"\nSequenze di 3 parole che contengono '{parola_chiave}' e compaiono più di {frequenza_minima} volte:\n")
        for sequenza, conteggio in sequenze_tre_parole.items():
            if parola_chiave in sequenza and conteggio > frequenza_minima:
                f.write(f"{sequenza}: {conteggio}\n")

# Percorso al tuo file JSON
percorso_file_json = 'C:\\Users\\nicol\\GitStack-Data-Analyzer\\stack-analyzer\\questions_and_answers.json'  # Modifica questo percorso

# Percorso per salvare il file di testo
percorso_file_output = 'C:\\Users\\nicol\\GitStack-Data-Analyzer\\stack-analyzer\\risultati_sequenze.txt'  # Modifica questo percorso

# Parola chiave per il filtro
parola_chiave = 'chatgpt'  # Modifica questa parola chiave

# Frequenza minima per includere una sequenza
frequenza_minima = 14  # Modifica questo valore secondo le tue necessità

# Leggi i dati dal file JSON
dati_json = leggi_file_json(percorso_file_json)

# Estrai e stampa le sequenze di dati
estrai_informazioni(dati_json)

# Conta le sequenze di 2 e 3 parole più comuni
sequenze_due_parole = conta_sequenze_comuni(dati_json, 2)
sequenze_tre_parole = conta_sequenze_comuni(dati_json, 3)

# Stampa i risultati
print("Sequenze di 2 parole più comuni:", sequenze_due_parole)
print("Sequenze di 3 parole più comuni:", sequenze_tre_parole)

# Salva i risultati in un file di testo, filtrando per la parola chiave e frequenza minima
salva_risultati(percorso_file_output, sequenze_due_parole, sequenze_tre_parole, parola_chiave, frequenza_minima)
