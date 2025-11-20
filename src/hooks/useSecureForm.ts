/**
 * Hook personalizado para validação de formulários com segurança
 * 
 * Integra validação, sanitização e feedback de segurança
 */

import { useState, useCallback } from 'react';
import { 
  sanitizeInput, 
  isValidEmail, 
  validatePasswordStrength,
  escapeHtml 
} from '@/lib/security';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  password?: boolean;
  custom?: (value: string) => boolean | string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function useSecureForm<T extends Record<string, string>>(
  initialValues: T,
  validationRules: ValidationRules
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Valida um campo específico
   */
  const validateField = useCallback(
    (name: string, value: string): string | null => {
      const rules = validationRules[name];
      if (!rules) return null;

      // Required
      if (rules.required && !value.trim()) {
        return 'Este campo é obrigatório';
      }

      // Min length
      if (rules.minLength && value.length < rules.minLength) {
        return `Mínimo de ${rules.minLength} caracteres`;
      }

      // Max length
      if (rules.maxLength && value.length > rules.maxLength) {
        return `Máximo de ${rules.maxLength} caracteres`;
      }

      // Email
      if (rules.email && !isValidEmail(value)) {
        return 'Email inválido';
      }

      // Password strength
      if (rules.password) {
        const { isValid, feedback } = validatePasswordStrength(value);
        if (!isValid) {
          return feedback[0] || 'Senha fraca';
        }
      }

      // Pattern
      if (rules.pattern && !rules.pattern.test(value)) {
        return 'Formato inválido';
      }

      // Custom validation
      if (rules.custom) {
        const result = rules.custom(value);
        if (typeof result === 'string') {
          return result;
        }
        if (!result) {
          return 'Validação falhou';
        }
      }

      return null;
    },
    [validationRules]
  );

  /**
   * Valida todos os campos
   */
  const validateAll = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((name) => {
      const error = validateField(name, values[name] || '');
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  /**
   * Atualiza valor de um campo com sanitização
   */
  const handleChange = useCallback(
    (name: keyof T, value: string) => {
      // Sanitiza entrada
      const sanitized = sanitizeInput(value);

      setValues((prev) => ({
        ...prev,
        [name]: sanitized,
      }));

      // Valida se campo já foi tocado
      if (touched[name as string]) {
        const error = validateField(name as string, sanitized);
        setErrors((prev) => ({
          ...prev,
          [name]: error || '',
        }));
      }
    },
    [touched, validateField]
  );

  /**
   * Marca campo como tocado
   */
  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Valida campo ao perder foco
      const error = validateField(name as string, values[name] || '');
      if (error) {
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [values, validateField]
  );

  /**
   * Submete formulário com validação
   */
  const handleSubmit = useCallback(
    async (
      onSubmit: (values: T) => Promise<void> | void
    ): Promise<boolean> => {
      setIsSubmitting(true);

      try {
        // Valida todos os campos
        const isValid = validateAll();
        if (!isValid) {
          setIsSubmitting(false);
          return false;
        }

        // Executa callback de submit
        await onSubmit(values);
        setIsSubmitting(false);
        return true;
      } catch (error) {
        console.error('Erro ao submeter formulário:', error);
        setIsSubmitting(false);
        return false;
      }
    },
    [values, validateAll]
  );

  /**
   * Reseta formulário
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Obtém valor sanitizado para exibição
   */
  const getSafeValue = useCallback(
    (name: keyof T): string => {
      return escapeHtml(values[name] || '');
    },
    [values]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    getSafeValue,
    validateField,
    validateAll,
  };
}

/**
 * Exemplo de uso:
 * 
 * const { values, errors, handleChange, handleBlur, handleSubmit } = useSecureForm(
 *   { email: '', password: '' },
 *   {
 *     email: { required: true, email: true },
 *     password: { required: true, password: true, minLength: 8 }
 *   }
 * );
 * 
 * <input
 *   value={values.email}
 *   onChange={(e) => handleChange('email', e.target.value)}
 *   onBlur={() => handleBlur('email')}
 * />
 * {errors.email && <span>{errors.email}</span>}
 */
