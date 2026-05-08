package com.booking.booking_ticket.utils;


import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;



public class EmailValidator implements ConstraintValidator<EmailConstraint, String> {

    /**
     * ^[a-zA-Z0-9._%+-]+ : Bắt đầu với chữ cái, số, dấu chấm (.), gạch dưới (_), dấu cộng (+), dấu gạch ngang (-).
     *
     * @: bắt buộc có
     * [a-zA-Z0-9.-]+ : Phần domain có thể chứa chữ cái, số, dấu chấm (.), dấu gạch ngang (-).
     * \.[a-zA-Z]{2,}$ : TLD (tên miền cuối) phải có từ 2 ký tự trở lên (.com, .vn, .net...).
     */
    private static final String NAME_PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

    /**
     * Khởi tạo các thông số cho annotation
     *
     * @param constraintAnnotation
     */
    @Override
    public void initialize(EmailConstraint constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }


    /**
     * Kiểm tra email có hợp lệ
     *
     * @param s Chuỗi truyền vào
     * @param constraintValidatorContext
     * @return Tính hợp lệ của email
     */
    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if(s == null) return true; //Để trống email cần dùng thì sửa
        return s.matches(NAME_PATTERN); //Kiểm tra tên hợp lệ không
    }
}
