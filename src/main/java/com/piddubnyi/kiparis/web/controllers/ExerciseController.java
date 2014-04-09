package com.piddubnyi.kiparis.web.controllers;

import com.piddubnyi.kiparis.model.Contact;
import com.piddubnyi.kiparis.model.Exercise;
import com.piddubnyi.kiparis.model.ExerciseVO;
import com.piddubnyi.kiparis.service.ContactService;
import com.piddubnyi.kiparis.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Date;
import java.util.List;

/**
 * Created by fil on 3/20/14.
 */
@Controller
@RequestMapping(value = "/")
public class ExerciseController {

    @Autowired
    ExerciseService exerciseService;
    @Autowired
    ContactService contactService;

    @RequestMapping(method = RequestMethod.GET)
    public String printExercises(ModelMap model, Principal principal) {

        List<Contact> contacts = contactService.listContact();
        String userName = principal.getName();

        model.addAttribute("userName", userName);
        model.addAttribute("contacts", contacts);
        return "exercisesTable";
    }

    @RequestMapping(value = "/exerciseNew", method = RequestMethod.POST)
    public String newExercise(@RequestParam String trainer,
                              @RequestParam @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date,
                              @RequestParam String startTime, @RequestParam String endTime, @RequestParam Integer contactId,
                              ModelMap modelMap) {

        Date startDate = new Date();
        startDate.setDate(date.getDate());
        startDate.setHours(Integer.parseInt(startTime.substring(0,2)));
        startDate.setMinutes(Integer.parseInt(startTime.substring(3, 5)));

        Date endDate = new Date();
        endDate.setDate(date.getDate());
        endDate.setHours(Integer.parseInt(endTime.substring(0,2)));
        endDate.setMinutes(Integer.parseInt(endTime.substring(3, 5)));

        Exercise exercise = new Exercise(contactService.findById(contactId),startDate, endDate, trainer, "available");
        exerciseService.addExercise(exercise);

        return "redirect:/";
    }

    @RequestMapping(value = "/exerciseEdit", method = RequestMethod.POST)
    public String exerciseEdit(@RequestParam Integer id, @RequestParam @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dateEdit,
                               @RequestParam String trainerEdit, @RequestParam String startTimeEdit, @RequestParam String endTimeEdit) {

        Date startDate = new Date();
        startDate.setDate(dateEdit.getDate());
        startDate.setHours(Integer.parseInt(startTimeEdit.substring(0,2)));
        startDate.setMinutes(Integer.parseInt(startTimeEdit.substring(3, 5)));

        Date endDate = new Date();
        endDate.setDate(dateEdit.getDate());
        endDate.setHours(Integer.parseInt(endTimeEdit.substring(0,2)));
        endDate.setMinutes(Integer.parseInt(endTimeEdit.substring(3, 5)));

        Exercise editExercise = exerciseService.findById(id);
        editExercise.setStart(startDate);
        editExercise.setEnd(endDate);
        editExercise.setGroup(trainerEdit);
        exerciseService.save(editExercise);

        return "redirect:/";
    }

    @RequestMapping(value = "/exercisesDataJson", method = RequestMethod.GET)
    public @ResponseBody List<ExerciseVO> exercisesDataJson(ModelMap model){
        return exerciseService.listExercisesVO();
    }
}
