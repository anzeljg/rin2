# encoding: utf-8
import tkinter as tk
import random

VEL = 80  # Velikost kocke
SRED = 40 # Središče kocke

# Definicija globalnih spremenljivk
kocka1 = 0 # Prva kocka
kocka2 = 0 # Druga kocka
izid = ""
REZULTAT = {"SKUPAJ":0, "ZMAGE":0}

# Določi krmilnik gumba 'Vrzi'
def vrzi():
  global kocka1, kocka2, izid
  # Naključni met obeh kock
  # 0 => 1 pika, ..., 5 => 6 pik
  kocka1 = random.randint(0, 5)
  pike1 = kocka1 + 1
  print("Kocka 1: ", pike1)
  kocka2 = random.randint(0, 5)
  pike2 = kocka2 + 1
  print("Kocka 2: ", pike2)

  vsota = pike1 + pike2
  if vsota == 7 or vsota == 11:
    # Zmaga
    izid = "Zmaga! Nova igra?"
    REZULTAT["ZMAGE"] += 1
    REZULTAT["SKUPAJ"] += 1
  elif vsota <= 3 or vsota == 12:
    # Poraz
    izid = "Poraz! Nova igra?"
    REZULTAT["SKUPAJ"] += 1
  else:
    # Igraj naprej...
    izid = "Vrzi ponovno..."
  izpis()


# Določi krmilnik izpisa/izrisa
def izpis():
  global kocka1, kocka2, izid

  # Izbriši vsebino platna
  platno.delete("all")

  # Nariši izbrano stran kocke
  poz1 = [40, 80]  # Zgornji levi kot prve kocke
  poz2 = [160, 80] # Zgornji levi kot druge kocke
  platno.create_image(poz1[0], poz1[1], \
    anchor=tk.NW, image=KOCKA[str(kocka1)])
  platno.create_image(poz2[0], poz2[1], \
    anchor=tk.NW, image=KOCKA[str(kocka2)])

  txt1 = izid
  txt2 = "zmage: " + str(REZULTAT["ZMAGE"]) \
         + ", skupaj: " + str(REZULTAT["SKUPAJ"])

  #platno.draw_text(txt1, [40, 40], 20, "white")
  #platno.draw_text(txt2, [40, 210], 20, "white")
  platno.create_text(40, 40, fill="white", anchor=tk.NW, \
    text=txt1, font=("Times", 15))
  platno.create_text(40, 210, fill="white", anchor=tk.NW, \
    text=txt2, font=("Times", 15))


# Ustvari okno, okvir in platno
okno = tk.Tk()
okno.title("Kocke")
okno.geometry("470x280")

okvir = tk.Frame(okno)
okvir.grid(row=0, column=0, pady=20)

platno = tk.Canvas(okno, width=280, height=240)
platno.configure(bg="green")
platno.grid(row=0, column=1, pady=20)

# Naloži slike kocke, ki so v mapi 'kocka'
KOCKA = {
  '0': tk.PhotoImage(file="kocka/kocka1.gif"),
  '1': tk.PhotoImage(file="kocka/kocka2.gif"),
  '2': tk.PhotoImage(file="kocka/kocka3.gif"),
  '3': tk.PhotoImage(file="kocka/kocka4.gif"),
  '4': tk.PhotoImage(file="kocka/kocka5.gif"),
  '5': tk.PhotoImage(file="kocka/kocka6.gif")
}

# Ustvari gumbe in jih poveži z dogodkovnimi krmilniki
gumb = tk.Button(okvir, text="Vrzi", command=vrzi)
gumb.configure(width=10)
gumb.grid(row=0, column=0, padx=45)

# Ustvari napise za opis igre
opis1 = tk.Label(okvir, text="") # Prazna vrstica
opis1.grid(row=1, column=0)
opis2 = tk.Label(okvir, text="Zmaga: vsota pik je 7 ali 11")
opis2.grid(row=2, column=0)
opis3 = tk.Label(okvir, text="Poraz: vsota pik je 2, 3 ali 12")
opis3.grid(row=3, column=0)

# Zaženi dogodkovno zanko
vrzi()
okno.mainloop()
