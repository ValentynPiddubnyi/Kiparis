package com.piddubnyi.kiparis.model;

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
    private String group = null;
    private String className = null;

    public Exercise(){}

    public Exercise(Date start, Date end, String content, String group, String className) {
        this.start = start;
        this.end = end;
        this.content = content;
        this.group = group;
        this.className = className;
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

    public void setGroup(String group) {
        this.group = group;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }
}
