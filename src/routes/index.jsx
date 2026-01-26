import Home from "../pages/Home";
import Products from "../pages/products";
import Layout from "../Layout";
import Cart from "../pages/Cart";




const routes=[
    {
        path:'/',
        element:<Layout/>,
        children:[
            {
                path:'/',
                element:<Home/>

            },
            {
                path:'/products',
                element:<Products/>
            },
            {
                path:'/cart',
                element:<Cart/>
            },

        ]

    },
    
]

export default routes