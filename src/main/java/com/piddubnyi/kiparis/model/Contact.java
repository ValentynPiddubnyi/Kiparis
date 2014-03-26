package com.piddubnyi.kiparis.model;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

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

    private String profession = null;

    @Temporal(TemporalType.TIMESTAMP)
    private Date created;

    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<Exercise> linkedExercises = new HashSet<Exercise>();

    public Contact() {
    }

    public Contact(Integer pacientNumber, String firstName, String secondName, String thirdName, Date birthday,
                   Diagnosis diagnosis, String profession) {
        this.pacientNumber = pacientNumber;
        this.firstName = firstName;
        this.secondName = secondName;
        this.thirdName = thirdName;
        this.birthday = birthday;
        this.diagnosis = diagnosis;
        this.profession = profession;
    }

    public Integer getExercisesPassed() {
       return linkedExercises.size();
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

    public Set<Exercise> getLinkedExercises() {
        return this.linkedExercises;
    }

    public void setLinkedExercises(Set<Exercise> linkedExercises) {
        this.linkedExercises = linkedExercises;
    }

    public void addLinkedExercises(Exercise exercise){
        exercise.setContact(this);
        getLinkedExercises().add(exercise);
    }

    public void removeLinkedExercises(Exercise exercise){
        getLinkedExercises().remove(exercise);
    }
}

