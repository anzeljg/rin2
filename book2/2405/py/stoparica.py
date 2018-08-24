# encoding: utf-8
import tkinter as tk

# Definicija globalnih spremenljivk
cas10  = 0 # število desetink sekunde
celih  = 0 # poizkusi, ustavljeni na celo sekundo
skupaj = 0 # vsi poizkusi
stevec = 0

# Pomožna funkcija, ki pretvori čas v desetinke
# sekunde in oblikuje izpis v obliko A:BC.D
def oblikuj_cas(t):
  D = t % 10
  E = t // 10
  A = E // 60
  S = E % 60
  B = S // 10
  C = S % 10
  return str(A) + ":" + str(B) + str(C) + "." + str(D)

# Določi časovni krmilnik za števec z intervalom
# 100 milisekund (desetinka sekunde)
def casovni_krmilnik():
  global cas10, stevec
  # Ponastavi čas, ko doseže 10 minut
  if (cas10 == 5999):
    cas10 = 0
  else:
    cas10 = cas10 + 1
  if stevec:
    izpis()
    okvir.after(100, casovni_krmilnik)

# Določi krmilnik izpisovanja na platno
def izpis():
  # Izbriši vsebino platna
  platno.delete("all")
  # Na novo napiši besedilo
  niz1 = str(celih) + "/" + str(skupaj)
  niz2 = oblikuj_cas(cas10)
  platno.create_text(160, 30, fill="white", text=niz1, \
    font=("Times", 18))
  platno.create_text(100, 100, fill="white", text=niz2, \
    font=("Times", 36))

# Določi krmilnik gumba 'Začni'
def zacni():
  global stevec
  stevec = 1 # Začni ali nadaljuj štopanje
  casovni_krmilnik()

# Določi krmilnik gumba 'Ustavi'
def ustavi():
  global cas10, celih, skupaj, stevec
  if stevec:
    stevec = 0 # Ustavi štopanje
    # Posodobi števec vseh poizkusov
    skupaj = skupaj + 1
    # Posodobi števec celih poizkusov
    if (cas10 % 10 == 0):
      celih = celih + 1
    izpis()

# Določi krmilnik gumba 'Nastavi'
def nastavi():
  global cas10, celih, skupaj, stevec
  cas10  = 0
  celih  = 0
  skupaj = 0
  stevec = 0
  izpis()

# Ustvari okno, okvir in platno
okno = tk.Tk()
okno.title("Štoparica")
okno.geometry("400x250")

okvir = tk.Frame(okno)
okvir.grid(row=0, column=0, pady=20)

platno = tk.Canvas(okno, width=200, height=200, bg="black")
platno.grid(row=0, column=1, pady=20)

platno.create_text(160, 30, fill="white", text="0/0", \
  font=("Times", 18))
platno.create_text(100, 100, fill="white", text="0:00.0", \
  font=("Times", 36))

# Poveži funkcije z dogodkovnimi krmilniki
gumb1 = tk.Button(okvir, text="Začni", command=zacni)
gumb1.configure(width=10)
gumb1.grid(row=0, column=0, padx=45)
gumb2 = tk.Button(okvir, text="Ustavi", command=ustavi)
gumb2.configure(width=10)
gumb2.grid(row=1, column=0, padx=45)
gumb3 = tk.Button(okvir, text="Nastavi", command=nastavi)
gumb3.configure(width=10)
gumb3.grid(row=2, column=0, padx=45)

# Zaženi dogodkovno zanko
okno.mainloop()
