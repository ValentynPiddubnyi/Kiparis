package com.piddubnyi.kiparis.dao;

import com.piddubnyi.kiparis.model.Exercise;

import java.util.List;

/**
 * Created by fil on 3/24/14.
 */
public interface ExerciseDAO {

        public void addExercise(Exercise exercise);
        public List<Exercise> listExercise();
        public void removeExercise(Integer id);
}
