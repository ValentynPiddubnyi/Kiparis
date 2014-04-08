package com.piddubnyi.kiparis.model;

import java.util.Date;

/**
 * Created by fil on 3/26/14.
 */
public class ExerciseVO {
    private Integer id = null;
    private Date start = null;
    private Date end = null;
    private String content = null;
    private String group = null;
    private String className = null;
    private String info = "Some info";

    public ExerciseVO() {
    }

    public ExerciseVO(Integer id, Date start, Date end, String content, String group, String className) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.content = content;
        this.group = group;
        this.className = className;
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

    public void setGroup(String group) {
        this.group = group;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }
}
