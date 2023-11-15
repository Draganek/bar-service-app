export function validateEmail(text) {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(text)
}
////rules
const availableRules = {
    required(value) {
        return value ? '' : 'Pole wymagane';
    },
    min(value, rule) {
        return value.length >= rule.length ? '' : `Min. znaków: ${rule.length}`;
    },
    email(value) {
        return validateEmail(value) ? '' : 'Niepoprawny email';
    }
}

////validaton
export function validate(rules = [], value) {
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i]

        if (rule instanceof Object) {
            const errorMessage = availableRules[rule.rule](value, rule);
            if (errorMessage) {
                return errorMessage;
            }
        } else {
            const errorMessage = availableRules[rule](value);
            if (errorMessage) {
                return errorMessage;
            }
        }
    };
    return '';
}
