package com.piddubnyi.kiparis.service;

import com.piddubnyi.kiparis.dao.ExerciseDAO;
import com.piddubnyi.kiparis.model.Exercise;
import com.piddubnyi.kiparis.model.ExerciseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    @Override
    @Transactional
    public Exercise findById(Integer id) {
        return exerciseDAO.findById(id);
    }

    @Override
    @Transactional
    public void save(Exercise exercise) {
        exerciseDAO.save(exercise);
    }

    public List<ExerciseVO> listExercisesVO(){
        List<ExerciseVO> listExercisesVO = new ArrayList<ExerciseVO>();
        for (Exercise exercise : exerciseDAO.listExercise()) {
            listExercisesVO.add(new ExerciseVO(exercise.getId(),exercise.getStart(),exercise.getEnd(),
                    exercise.getContent(),exercise.getGroup(),exercise.getClassName()));
        }
        return listExercisesVO;
    }
}
