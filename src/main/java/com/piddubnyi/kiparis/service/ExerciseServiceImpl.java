package com.piddubnyi.kiparis.service;

import com.piddubnyi.kiparis.dao.ExerciseDAO;
import com.piddubnyi.kiparis.model.Exercise;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by fil on 3/24/14.
 */
@Service
public class ExerciseServiceImpl implements ExerciseService {

    @Autowired
    ExerciseDAO exerciseDAO;

    @Override
    public void addExercise(Exercise exercise) {
        exerciseDAO.addExercise(exercise);
    }

    @Override
    public List<Exercise> listExercises() {
        return exerciseDAO.listExercise();
    }

    @Override
    public void removeExercise(Integer id) {
        exerciseDAO.removeExercise(id);
    }
}
