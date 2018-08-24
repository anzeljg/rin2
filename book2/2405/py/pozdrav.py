# encoding: utf-8
import tkinter as tk

besedilo = "Lep pozdrav!"

# Krmilnik za klik miške na gumb
def klik():
  global besedilo
  besedilo = "Bravo!"
  # Izbriši vsebino platna
  platno.delete("all")
  # Na novo napiši besedilo
  platno.create_text(150, 100, fill="red", text=besedilo, \
    font=("Times", 27))

# Ustvari okno, okvir in platno
okno = tk.Tk()
okno.title("Okno")
okno.geometry("500x250")

okvir = tk.Frame(okno)
okvir.grid(row=0, column=0, pady=20)

platno = tk.Canvas(okno, width=300, height=200, bg="black")
platno.grid(row=0, column=1, pady=20)

platno.create_text(150, 100, fill="red", text=besedilo, \
  font=("Times", 27))

# Poveži funkcije z dogodkovnimi krmilniki
gumb = tk.Button(okvir, text="Klikni", command=klik)
gumb.configure(width=10)
gumb.grid(row=0, column=0, padx=45)

# Zaženi dogodkovno zanko
okno.mainloop()

