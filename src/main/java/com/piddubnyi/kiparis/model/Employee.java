package com.piddubnyi.kiparis.model;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by fil on 4/2/14.
 */
@Entity
@Table(name = "EMPLOYEE")
public class Employee {

    @Id
    @Column(name = "ID")
    @GeneratedValue
    private Integer id = null;

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

    private String education = null;

    private String phone = null;

    private String email = null;

    private String workExperience = null;

    private Integer salary = null;

    private String address = null;

    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date firstWorkDay = null;

    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date lastWorkDay = null;

    @Transient
    private String documents = "Some document. e.g: Passport copy, diploma copy etc.";


    private String recommendation = null;

    private Integer rating = null;

    private Float sellaryCoefficient = null;

    @Transient
    private List<Comment> listCommentsPublick;

    @Transient
    private List<Contact> listCommentsPrivate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date created;

    public Employee(){}

    public Employee(String firstName, String secondName, String thirdName, Date birthday) {
        this.firstName = firstName;
        this.secondName = secondName;
        this.thirdName = thirdName;
        this.birthday = birthday;
    }

    public Set<Exercise> getCreatedExercises() {
        return this.createdExercises;
    }

    public void setCreatedExercises(Set<Exercise> createdExercises) {
        this.createdExercises = createdExercises;
    }

    public void addCreatedExercises(Exercise exercise){
        exercise.setEmployee(this);
        getCreatedExercises().add(exercise);
    }

    public void removeCreatedExercises(Exercise exercise){
        getCreatedExercises().remove(exercise);
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @OneToMany(mappedBy = "employee", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Exercise> createdExercises = new HashSet<Exercise>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
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

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWorkExperience() {
        return workExperience;
    }

    public void setWorkExperience(String workExpirience) {
        this.workExperience = workExpirience;
    }

    public Integer getSalary() {
        return salary;
    }

    public void setSalary(Integer sellary) {
        this.salary = sellary;
    }

    public String getAddres() {
        return address;
    }

    public void setAddres(String addres) {
        this.address = addres;
    }

    public Date getFirstWorkDay() {
        return firstWorkDay;
    }

    public void setFirstWorkDay(Date firstWorkDay) {
        this.firstWorkDay = firstWorkDay;
    }

    public Date getLastWorkDay() {
        return lastWorkDay;
    }

    public void setLastWorkDay(Date lastWorkDay) {
        this.lastWorkDay = lastWorkDay;
    }

    public String getDocuments() {
        return documents;
    }

    public void setDocuments(String documents) {
        this.documents = documents;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Float getSellaryCoefficient() {
        return sellaryCoefficient;
    }

    public void setSellaryCoefficient(Float sellaryCoefficient) {
        this.sellaryCoefficient = sellaryCoefficient;
    }

    public List<Comment> getListCommentsPublick() {
        return listCommentsPublick;
    }

    public void setListCommentsPublick(List<Comment> listCommentsPublick) {
        this.listCommentsPublick = listCommentsPublick;
    }

    public List<Contact> getListCommentsPrivate() {
        return listCommentsPrivate;
    }

    public void setListCommentsPrivate(List<Contact> listCommentsPrivate) {
        this.listCommentsPrivate = listCommentsPrivate;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }


}
