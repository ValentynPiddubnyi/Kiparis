package com.piddubnyi.kiparis.web.controllers;

import com.piddubnyi.kiparis.model.Contact;
import com.piddubnyi.kiparis.model.Exercise;
import com.piddubnyi.kiparis.service.ExercisesList;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by fil on 3/20/14.
 */
@Controller
@RequestMapping(value = "/")
public class ExerciseController {

    @RequestMapping(method = RequestMethod.GET)
    public String printExercises(ModelMap model) {
        return "exercisesTable";
    }

    @RequestMapping(value = "/exercisesDataJson", method = RequestMethod.GET)
    public @ResponseBody List<Exercise> exercisesDataJson(ModelMap model){
        ExercisesList.addExercise(new Exercise());
        ExercisesList exercisesList = new ExercisesList();
        return ExercisesList.getItems();
    }
}
