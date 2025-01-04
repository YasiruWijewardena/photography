// lib/validationUtils.js

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  export const validateMobileNum = (mobile_num) => {
    const mobileRegex = /^\d{10,15}$/;
    return mobileRegex.test(mobile_num);
  };