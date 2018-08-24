# encoding: utf-8
import tkinter as tk
import random

VEL = 128 # Velikost kovanca, npr. 128x128
POL = 64  # Polmer kovanca = pol velikosti

# Definicija globalnih spremenljivk
stran = 0 # Stran kovanca: cifra ali mož
REZULTAT = {"CIFRA":0, "MOZ":0}


# Določi rokovalnik gumba 'Vrzi'
def vrzi():
  global stran
  stran = random.randint(0, 1)

  if stran == 1:
    REZULTAT["CIFRA"] += 1
  else:
    REZULTAT["MOZ"] += 1
  print(REZULTAT)
  izpis()


# Določi rokovalnik izpisa/izrisa
def izpis():
  global stran

  # Izbriši vsebino platna
  platno.delete("all")
  # Nariši izbrano stran kovanca
  poz = [36, 36] # Zgornji levi kot kovanca
  platno.create_image(poz[0], poz[1], \
    anchor=tk.NW, image=KOVANEC[str(stran)])


# Ustvari okno, okvir in platno
okno = tk.Tk()
okno.title("Kovanec")
okno.geometry("390x240")

okvir = tk.Frame(okno)
okvir.grid(row=0, column=0, pady=20)

platno = tk.Canvas(okno, width=200, height=200)
platno.configure(bg="lightgray")
platno.grid(row=0, column=1, pady=20)

# Naloži sliki kovanca, ki sta v isti mapi
# kot datoteka 'coin.py'
KOVANEC = {
  '0': tk.PhotoImage(file="2euro_back.gif"),
  '1': tk.PhotoImage(file="2euro_front.gif")
}

# Ustvari gumbe in jih poveži z dogodkovnimi rokovalniki
gumb = tk.Button(okvir, text="Vrzi", command=vrzi)
gumb.configure(width=10)
gumb.grid(row=0, column=0, padx=45)

# Zaženi dogodkovno zanko
vrzi()
okno.mainloop()
