export function validatePassword(password) {
    const rules = {
        minLength: 8,
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /[0-9]/,
        special: /[^A-Za-z0-9]/,
    };

    if (password.length < rules.minLength) {
        return {
            valid: false,
            message: "Password must be at least 8 characters long.",
        };
    }

    if (!rules.uppercase.test(password)) {
        return {
            valid: false,
            message: "Password must include at least one uppercase letter.",
        };
    }

    if (!rules.lowercase.test(password)) {
        return {
            valid: false,
            message: "Password must include at least one lowercase letter.",
        };
    }

    if (!rules.number.test(password)) {
        return {
            valid: false,
            message: "Password must include at least one number.",
        };
    }

    if (!rules.special.test(password)) {
        return {
            valid: false,
            message: "Password must include at least one special character.",
        };
    }

    return {
        valid: true,
        message: "Password meets all requirements.",
    };
}