package com.piddubnyi.kiparis.dao;

import com.piddubnyi.kiparis.model.Contact;
import com.piddubnyi.kiparis.model.Exercise;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by fil on 3/24/14.
 */

@Repository
public class ExerciseDAOImpl implements ExerciseDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    @Transactional
    public void addExercise(Exercise exercise) {
        sessionFactory.getCurrentSession().save(exercise);
    }

    @Override
    @Transactional
    public List<Exercise> listExercise() {
        return sessionFactory.getCurrentSession().createQuery("from Exercise").list();
    }

    @Override
    @Transactional
    public void removeExercise(Integer id) {
        Exercise exercise = (Exercise) sessionFactory.getCurrentSession().load(Exercise.class, id);
        if (null != exercise) {
            sessionFactory.getCurrentSession().delete(exercise);
        }

    }
}
