export const validatePassword = (req, res) => {
    const { password, minLength, minLowercase, minUppercase, minNumbers, minSpecialChars } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Se requiere contraseña' });
    }

    let errors = [];

    if (password.length < minLength) {
        errors.push(`La contraseña debe ser al menos ${minLength} Caracteres largos`);
    }

    const lowercaseCount = (password.match(/[a-z]/g) || []).length;
    if (lowercaseCount < minLowercase) {
        errors.push(`La contraseña debe tener al menos ${minLowercase} caracteres en minúscula`);
    }

    const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
    if (uppercaseCount < minUppercase) {
        errors.push(`La contraseña debe tener al menos ${minUppercase} caracteres en mayúscula`);
    }

    const numberCount = (password.match(/\d/g) || []).length;
    if (numberCount < minNumbers) {
        errors.push(`La contraseña debe tener al menos ${minNumbers} números`);
    }

    const specialCharCount = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
    if (specialCharCount < minSpecialChars) {
        errors.push(`La contraseña debe tener al menos ${minSpecialChars} caracteres especiales`);
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    return res.status(200).json({ message: 'Contraseña incorrecta' });
};
