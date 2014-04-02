package com.piddubnyi.kiparis.model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by fil on 4/2/14.
 */
@Entity
@Table(name = "COMMENTS")
public class Comment {

    @Id
    @GeneratedValue
    private Integer id = null;

    private boolean isPublic = true;

    private String textBody = null;

    @ManyToOne
    @JoinColumn(name = "CONTACT_ID")
    private Contact contact;

    private String author = null;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = null;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public String getTextBody() {
        return textBody;
    }

    public void setTextBody(String textBody) {
        this.textBody = textBody;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
