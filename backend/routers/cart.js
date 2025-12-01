const router = require("express").Router();
const User = require('../model/user');
const { authenticateToken } = require('./userAuth');

// put book to cart
router.put('/add-to-cart', authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userdata = await User.findById(id);
        const isBookinCart = userdata.cart.includes(bookid);

        if (isBookinCart) {
            return res.json({
                status: "success",
                message: "Book is already in cart"
            })
        }
        await User.findByIdAndUpdate(id, {
            $push: { cart: bookid }
        })
        return res.json({
            status: "success",
            message: "Book add to cart",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" })
    }
})

// remove book from cart
router.put('/remove-from-cart/:bookid', authenticateToken, async (req, res) => {
    const { bookid } = req.params;
    const { id } = req.headers;
    try {
        await User.findByIdAndUpdate(id, {
            $pull: { cart: bookid }
        });
        return res.json({
            status: "success",
            message: "Book remove from cart"
        })
    } catch (error) {
        return res.status(500).json({ message: "an error occurred" })
    }
})

router.get('/get-user-cart', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate('cart');
        const Cart = userData.cart.reverse();

        return res.json({
            status:"success",
            data:Cart,
        })
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" })
    }
})

module.exports = router;