package com.piddubnyi.kiparis.service;

import com.piddubnyi.kiparis.model.Exercise;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by fil on 3/20/14.
 */
public class ExercisesList {

    private static List<Exercise> items = new ArrayList<>();

    public static List<Exercise> getItems() {
        return items;
    }

    public static void setItems(List<Exercise> items) {
        ExercisesList.items = items;
    }

    public static void addExercise(Exercise exercise) {
        items.add(exercise);
    }

    public static void removeExercise(Exercise exercise){
        items.remove(exercise);
    }
}
