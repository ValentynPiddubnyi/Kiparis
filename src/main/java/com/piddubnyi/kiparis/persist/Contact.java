package com.piddubnyi.kiparis.persist;

import com.piddubnyi.kiparis.model.Diagnosis;

import java.util.Random;

/**
 	 * Created by Fil on 07/03/14.
 	 */
     public class Contact {

                    private Integer pacientNumber = 1;
                    private String photo = "link to photo";
                    private String firstName = null;
                    private String secendName = null;
                    private String thirdName = null;
                    private Integer birthday = null;
                    private Diagnosis diagnosis = null;
                    Random rn = new Random();
                    private Integer exercisesPassed = rn.nextInt();
                    private String profession = null;

                    public Contact(){}
    
            	    public Integer getPacientNumber() {
        	        return pacientNumber;
        	    }
    
            	    public void setPacientNumber(Integer pacientNumber) {
        	        this.pacientNumber = pacientNumber;
        	    }
    
            	    public Contact(Integer pacientNumber, String firstName, String secendName, String thirdName, Integer birthday, Diagnosis diagnosis, Integer exercisesPassed, String profession){
        	        this.pacientNumber = pacientNumber;
        	        this.firstName = firstName;
                    this.secendName = secendName;
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
    
            	    public String getSecendName() {
        	        return secendName;
        	    }
    
            	    public void setSecendName(String secendName) {
        	        this.secendName = secendName;
        	    }
    
            	    public String getThirdName() {
        	        return thirdName;
        	    }
    
            	    public void setThirdName(String thirdName) {
        	        this.thirdName = thirdName;
        	    }
    
            	    public Integer getBirthday() {
        	        return birthday;
        	    }
    
            	    public void setBirthday(Integer birthday) {
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

}

