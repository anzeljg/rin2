# encoding: utf-8
import tkinter as tk
import random

VEL = 80  # Velikost kocke
SRED = 40 # Središče kocke

# Definicija globalnih spremenljivk
kocka1 = 0 # Prva kocka
kocka2 = 0 # Druga kocka


# Določi rokovalnik gumba 'Vrzi'
def vrzi():
  global kocka1, kocka2
  # Naključni met obeh kock
  # 0 => 1 pika, ..., 5 => 6 pik
  kocka1 = random.randint(0, 5)
  pike1 = kocka1 + 1
  print("Kocka 1: ", pike1)
  kocka2 = random.randint(0, 5)
  pike2 = kocka2 + 1
  print("Kocka 2: ", pike2)
  izpis()


# Določi rokovalnik izpisa/izrisa
def izpis():
  global kocka1, kocka2

  # Izbriši vsebino platna
  platno.delete("all")

  # Nariši izbrano stran kocke
  poz1 = [40, 40]  # Zgornji levi kot prve kocke
  poz2 = [160, 40] # Zgornji levi kot druge kocke
  platno.create_image(poz1[0], poz1[1], \
    anchor=tk.NW, image=KOCKA[str(kocka1)])
  platno.create_image(poz2[0], poz2[1], \
    anchor=tk.NW, image=KOCKA[str(kocka2)])


# Ustvari okno, okvir in platno
okno = tk.Tk()
okno.title("Kocke")
okno.geometry("470x200")

okvir = tk.Frame(okno)
okvir.grid(row=0, column=0, pady=20)

platno = tk.Canvas(okno, width=280, height=160)
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

# Ustvari gumbe in jih poveži z dogodkovnimi rokovalniki
gumb = tk.Button(okvir, text="Vrzi", command=vrzi)
gumb.configure(width=10)
gumb.grid(row=0, column=0, padx=45)

# Zaženi dogodkovno zanko
vrzi()
okno.mainloop()
