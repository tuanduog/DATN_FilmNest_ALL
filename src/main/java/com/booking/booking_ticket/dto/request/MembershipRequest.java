package com.booking.booking_ticket.dto.request;

import java.time.OffsetDateTime;

public class MembershipRequest {
    private String vip;
    private OffsetDateTime startDate;
    private Integer expire;

    public String getVip() {
        return vip;
    }
    public void setVip(String vip) {
        this.vip = vip;
    }
    public OffsetDateTime getStartDate() {
        return startDate;
    }
    public void setStartDate(OffsetDateTime startDate) {
        this.startDate = startDate;
    }
    public Integer getExpire() {
        return expire;
    }
    public void setExpire(Integer expire) {
        this.expire = expire;
    }
}
