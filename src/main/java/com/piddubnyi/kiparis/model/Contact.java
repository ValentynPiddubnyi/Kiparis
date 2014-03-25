package com.piddubnyi.kiparis.model;

import com.piddubnyi.kiparis.model.Diagnosis;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.util.Date;
import java.util.Random;

/**
 * Created by Fil on 07/03/14.
 */
@Entity
@Table(name = "CONTACTS")
public class Contact {

    @Id
    @Column(name = "ID")
    @GeneratedValue
    private Integer pacientNumber = null;

    @Transient
    private String photo = "link to photo";

    @Column(name = "firstName")
    private String firstName = null;

    @Column(name = "secondName")
    private String secondName = null;

    @Column(name = "thirdName")
    private String thirdName = null;

    @Column(name = "birthday")
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date birthday = null;
    @Transient
    private Diagnosis diagnosis = null;
    @Transient
    Random rn = new Random();
    @Transient
    private Integer exercisesPassed = rn.nextInt();
    private String profession = null;
    @Temporal(TemporalType.TIMESTAMP)
    private Date created;

    public Contact() {
    }

    public Contact(Integer pacientNumber, String firstName, String secondName, String thirdName, Date birthday,
                   Diagnosis diagnosis, Integer exercisesPassed, String profession) {
        this.pacientNumber = pacientNumber;
        this.firstName = firstName;
        this.secondName = secondName;
        this.thirdName = thirdName;
        this.birthday = birthday;
        this.diagnosis = diagnosis;
        this.exercisesPassed = exercisesPassed;
        this.profession = profession;
    }


    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getSecondName() {
        return secondName;
    }

    public void setSecondName(String secondName) {
        this.secondName = secondName;
    }

    public String getThirdName() {
        return thirdName;
    }

    public void setThirdName(String thirdName) {
        this.thirdName = thirdName;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public Diagnosis getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(Diagnosis diagnosis) {
        this.diagnosis = diagnosis;
    }

    public Integer getExercisesPassed() {
        return exercisesPassed;
    }

    public void setExercisesPassed(Integer exercisesPassed) {
        this.exercisesPassed = exercisesPassed;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }


    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public Date getCreated() {
        return created;
    }
    public Integer getPacientNumber() {
        return pacientNumber;
    }

    public void setPacientNumber(Integer pacientNumber) {
        this.pacientNumber = pacientNumber;
    }


}

