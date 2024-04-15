import { useState } from "react"
import Guitar from "./components/Guitar"
import Header from "./components/Header"
import { db } from "./data/db";

function App() {
  const [data, setData] = useState(db);
  const [cart, setCart] = useState([]);
  //https://doesitmutate.xyz/ dont mutate the state 
  function addItem(item){
    //verify if the item already exist in the state
    const itemExist = cart.findIndex(e=>e.id===item.id);
    if (itemExist >= 0) {
      //exist
      //update quantity
      //cart[itemExist].quantity++, WRONG it will mutate the state
      //how to?
      //Create a copy of the cart
      const updatedCart = [...cart];
      updatedCart[itemExist].quantity++;
      setCart(updatedCart);//always modify state with setFunction

    } else {
      //does not exist
      //adding quantity prop because this item is a cartItem not a guitar
      //first time quantity is 1
      item.quantity=1;
      setCart([...cart,item]);//because if I use push it will mutate the state
    }
  }


  function removeItem(id){
    setCart(prevCart=>prevCart.filter((e)=>e.id!==id));
    //the set function already knows what is in the state
    //and you can used it via callback as it is avoid and the parameter is the previous cart
  }
  
  return (
    <>
      <Header
        cart = {cart}
        removeItem = {removeItem}
      />
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {
            data.map((e)=>(
              <Guitar 
                key={e.id} 
                guitar={e}
                addItem={addItem}
                />
            ))
          }
        </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>
    </>
  )
}

export default App
