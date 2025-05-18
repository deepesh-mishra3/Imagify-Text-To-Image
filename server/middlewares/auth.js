import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' })
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            console.log(tokenDecode.id);
            // Step 3: If body is undefined, initialize it
            if (!req.body) {
                req.body = {}; // Fixes "Cannot set properties of undefined"
            }
            req.body.userId = tokenDecode.id;
        } else {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }

        // to go to the next() 
        next()

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export default userAuth;

