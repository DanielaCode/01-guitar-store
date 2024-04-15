import { useEffect, useState } from "react"
import Guitar from "./components/Guitar"
import Header from "./components/Header"
import { db } from "./data/db";

//this website will be deploy in netlify
function App() {

  const storageInitialCart = () =>{
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart):[];
  }

  const [data] = useState(db);
  const [cart, setCart] = useState(storageInitialCart);

  useEffect(()=>{localStorage.setItem("cart",JSON.stringify(cart))},[cart])
  //manage secundary effects of the change of an state so any time cart change this will happen

  //https://doesitmutate.xyz/ dont mutate the state 
  function addItem(item){
    //verify if the item already exist in the state
    const itemExist = cart.findIndex(e=>e.id===item.id);
    if (itemExist >= 0) {
        if(cart[itemExist].quantity>=5)
          return;
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
    //IMPORTANT!! the localstorage will be fill in the second attend because:
    //STATE IS ASYNC , so the can set happens after this call to savelocalstorage
    //otherwise the set will block the render
    //saveLocalStorage();
    //better use useEffect
  }


  function removeItem(id){
    setCart(prevCart=>prevCart.filter((e)=>e.id!==id));
    //the set function already knows what is in the state
    //and you can used it via callback as it is avoid and the parameter is the previous cart
  }

  function increaseQuantity(id){
    const updatedCart = cart.map((e)=>{
      if(e.id===id && e.quantity < 5){
        return{
          ...e,
          quantity:e.quantity+1
        }
      }
      return e;
    });
    setCart(updatedCart);
  }

  function clearCart(){
    setCart([]);
  }

  function decreaseQuantity(id){
    const updatedCart = cart.map((e)=>{
      if(e.id===id && e.quantity > 1){
        return{
          ...e,
          quantity:e.quantity-1
        }
      }
      return e;
    });
    setCart(updatedCart);
  }

  // function saveLocalStorage(){
  //   localStorage.setItem("cart",JSON.stringify(cart));
  //   //localstorage only save strings
  // }

  return (
    <>
      <Header
        cart = {cart}
        removeItem = {removeItem}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
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
