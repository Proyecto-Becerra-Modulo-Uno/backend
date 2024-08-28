export const validatePassword = (req, res) => {
    const { password, minLength, minLowercase, minUppercase, minNumbers, minSpecialChars } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    let errors = [];

    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long`);
    }

    const lowercaseCount = (password.match(/[a-z]/g) || []).length;
    if (lowercaseCount < minLowercase) {
        errors.push(`Password must have at least ${minLowercase} lowercase characters`);
    }

    const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
    if (uppercaseCount < minUppercase) {
        errors.push(`Password must have at least ${minUppercase} uppercase characters`);
    }

    const numberCount = (password.match(/\d/g) || []).length;
    if (numberCount < minNumbers) {
        errors.push(`Password must have at least ${minNumbers} numbers`);
    }

    const specialCharCount = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
    if (specialCharCount < minSpecialChars) {
        errors.push(`Password must have at least ${minSpecialChars} special characters`);
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    return res.status(200).json({ message: 'Password is valid' });
};
