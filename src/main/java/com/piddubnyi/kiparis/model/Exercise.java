package com.piddubnyi.kiparis.model;

import org.springframework.format.annotation.DateTimeFormat;

import javax.lang.model.element.Name;
import javax.persistence.*;
import java.util.Date;

/**
 * Created by fil on 3/20/14.
 */
@Entity
@Table(name = "EXERCISES")
public class Exercise {

/*    private String start = "2014-03-20T14:00:00";
    private String end = "2014-03-20T21:51:00";
    private String content = "Available";
    private String group = "Trenagor1";
    private String className = "available";*/

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
}
