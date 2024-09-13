import PasswordValidator from "password-validator"
import * as EmailValidator from 'email-validator';

export const validatePassword = (password: string, cpassword?: string | undefined) => {
    const s = new PasswordValidator();

    s.is().min(8)
        .is().max(20)
        .has().uppercase()
        .has().lowercase()
        .has().digits(2)
        .has().not().spaces()
        .has().symbols()

    

    return s.validate(password, { list: false }) as boolean && (cpassword ? password === cpassword : true)
}

export const emailValidator = (email: string) => {
    return EmailValidator.validate(email)
}