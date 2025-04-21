import { Request, Response } from 'express'

import User from '../../models/user.model'
import ForgotPassword from '../../models/forgot-password.model'

import md5 from 'md5'
import * as generate from '../../helpers/generate'
import * as sendMailHelper from '../../helpers/sendMail'

// [GET] /register
export const register = async (req: Request, res: Response) => {
   
    res.render('client/pages/users/register', {
        title: 'Register'
    })
}

// [POST] /register
export const registerPost = async (req: Request, res: Response) => {
    const exitsEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    if(exitsEmail) {
        req.flash('error', 'Email đã tồn tại')
        return res.redirect(req.headers.referer || '/')
    }

    req.body.password = md5(req.body.password)
    const user = new User(req.body)
    await user.save()

    res.cookie('tokenUser', user.tokenUser)

    res.redirect('/')
}

// [GET] /login
export const login = async (req: Request, res: Response) => {
    res.render('client/pages/users/login', {
        title: 'Login'
    })
}

// [POST] /login
export const loginPost = async (req: Request, res: Response) => {
    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user) {
        req.flash('error', 'Email không tồn tại')
        return  res.redirect(req.headers.referer || '/')  
    }
    if(md5(password) !== user.password) {
        req.flash('error', 'Mật khẩu không đúng')
        return  res.redirect(req.headers.referer || '/')  
    }
    if(user.status == 'inactive') {
        req.flash('error', 'Tài khoản đã bị khóa')
        return  res.redirect(req.headers.referer || '/')  
    }

    res.cookie('tokenUser', user.tokenUser)

    // Lưu userId và collection cart 
    // await Cart.updateOne(
    //     {
    //         _id: req.cookies.cartId
    //     },
    //     {
    //         user_id: user.id
    //     }
    // )

    res.redirect('/')
}

// [GET] /logout
export const logout = async (req: Request, res: Response) => {
    res.clearCookie('tokenUser')
    res.redirect('/')
}

// [GET] /password/forgot
export const forgotPassword = async (req: Request, res: Response) => {
    res.render('client/pages/users/forgot-password', {
        title: 'Quên mật khẩu'
    })
}

// [POST] /password/forgot
export const forgotPasswordPost = async (req: Request, res: Response) => {
    const email = req.body.email
    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user) {
        req.flash('error', 'Email không tồn tại')
        return res.redirect(req.headers.referer || '/')  
    }

    // Tạo mã otp và lưu Otp, email vào db
    const otp = generate.generateRandomNumber(6)

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expriredAt: Date.now() 
    }

    const forgotPasswordData = new ForgotPassword(objectForgotPassword)
    await forgotPasswordData.save()

    // Gửi Otp qua email
    const subject = 'Xác thực OTP'
    const html = `
        <h1>Xác thực OTP</h1>
        <p>Mã OTP của bạn là: <strong>${otp}</strong></p>
        <p>Vui lòng không chia sẻ mã OTP này với bất kỳ ai.</p>
    `

    sendMailHelper.sendMail(email, subject, html)
    req.flash('success', 'Mã OTP đã được gửi đến email của bạn')

    res.redirect(`/users/password/otp?email=${email}`)
}

// [GET] /password/otp
export const otpPassword = async (req: Request, res: Response) => {
    const email = req.query.email

    res.render('client/pages/users/otp-password', {
        title: 'Xác thực OTP',
        email: email
    })
}

// [POST] /password/otp
export const otpPasswordPost = async (req: Request, res: Response) => {
    const email = req.body.email
    const otp = req.body.otp

    const forgotPasswordData = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    if(!forgotPasswordData) {
        req.flash('error', 'Mã OTP không đúng hoặc đã hết hạn')
        return res.redirect(req.headers.referer || '/')  
    }

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        req.flash('error', 'User not found')
        return res.redirect(req.headers.referer || '/')
    }

    res.cookie('tokenUser', user.tokenUser)

    res.redirect(`/users/password/reset?email=${email}`)
}

// [GET] /password/reset
export const resetPassword = async (req: Request, res: Response) => {
    const email = req.query.email

    res.render('client/pages/users/reset-password', {
        title: 'Đặt lại mật khẩu',
        email: email
    })
}

// [POST] /password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser
   
    await User.updateOne(
        {
            tokenUser: tokenUser
        },
        {
            password: md5(password)
        }
    )
    
    res.redirect('/user/login')
    req.flash('success', 'Đặt lại mật khẩu thành công')
}

// [GET] /info
export const info = async (req: Request, res: Response) => {
    res.render('client/pages/users/info', {
        title: 'Thông tin tài khoản'
    })
}