export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateRequired = (value: any): boolean => {
  return value !== undefined && value !== null && value !== '';
};

export const validateNumber = (value: string): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
};

export const validatePositiveNumber = (value: string): boolean => {
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num) && num > 0;
};

export const validateProductData = (data: any): string[] => {
  const errors: string[] = [];

  if (!validateRequired(data.name)) {
    errors.push('Product name is required');
  }

  if (!validateRequired(data.price)) {
    errors.push('Product price is required');
  } else if (!validatePositiveNumber(data.price)) {
    errors.push('Product price must be a positive number');
  }

  if (!validateRequired(data.category_id)) {
    errors.push('Product category is required');
  }

  return errors;
};

export const validateOrderData = (data: any): string[] => {
  const errors: string[] = [];

  if (!validateRequired(data.customer_id)) {
    errors.push('Customer ID is required');
  }

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push('At least one order item is required');
  }

  if (data.items) {
    for (const item of data.items) {
      if (!validateRequired(item.product_id)) {
        errors.push('Product ID is required for each item');
      }

      if (
        !validateRequired(item.quantity) ||
        !validatePositiveNumber(item.quantity)
      ) {
        errors.push('Quantity must be a positive number');
      }

      if (
        !validateRequired(item.unit_price) ||
        !validatePositiveNumber(item.unit_price)
      ) {
        errors.push('Unit price must be a positive number');
      }
    }
  }

  return errors;
};

export const validateCustomerData = (data: any): string[] => {
  const errors: string[] = [];

  if (!validateRequired(data.full_name)) {
    errors.push('Họ tên không được để trống');
  }

  if (!validateRequired(data.email)) {
    errors.push('Email không được để trống');
  } else if (!validateEmail(data.email)) {
    errors.push('Email không đúng định dạng');
  }

  if (!validateRequired(data.password)) {
    errors.push('Mật khẩu không được để trống');
  } else if (!validatePassword(data.password)) {
    errors.push('Mật khẩu phải có 8 ký tự bao gồm chữ hoa, chữ thường và số');
  }
  return errors;
};
