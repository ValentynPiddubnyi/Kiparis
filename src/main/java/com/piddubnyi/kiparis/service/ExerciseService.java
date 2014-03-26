package com.piddubnyi.kiparis.service;

import com.piddubnyi.kiparis.model.Exercise;
import com.piddubnyi.kiparis.model.ExerciseVO;

import java.util.List;

/**
 * Created by fil on 3/24/14.
 */
public interface ExerciseService {
    public void addExercise(Exercise exercise);
    public List<Exercise> listExercises();
    public void removeExercise(Integer id);

    public List<ExerciseVO> listExercisesVO();
}
