package com.piddubnyi.kiparis.model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by fil on 3/20/14.
 */
@Entity
@Table(name = "EXERCISES")
public class Exercise {

    @Id
    @GeneratedValue
    private Integer id = null;

    private Date start = null;

    private Date end = null;

    private String content = null;

    @Column(name = "trainer")
    private String group = null;

    private String className = null;

    @ManyToOne
    @JoinColumn(name = "CONTACT_ID")
    private Contact contact;

    @ManyToOne
    @JoinColumn(name = "EMPLOYEE_ID")
    private Employee employee;

    public Exercise(){}

    public Exercise(Contact contact, Date start, Date end, String trainer, String className) {
        this.contact = contact;
        this.start = start;
        this.end = end;
        this.group = trainer;
        this.className = className;
        this.content = contact.getSecondName() + " " + contact.getFirstName();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getStart() {
        return start;
    }

    public void setStart(Date start) {
        this.start = start;
    }

    public Date getEnd() {
        return end;
    }

    public void setEnd(Date end) {
        this.end = end;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String trainer) {
        this.group = trainer;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    public Employee getEmployee() {
        return this.employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}
