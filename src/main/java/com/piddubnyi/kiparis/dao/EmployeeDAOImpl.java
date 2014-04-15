package com.piddubnyi.kiparis.dao;

import com.piddubnyi.kiparis.model.Employee;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by fil on 4/15/14.
 */
@Repository
public class EmployeeDAOImpl implements EmployeeDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    @Transactional
    public void addEmployee(Employee employee) {
        sessionFactory.getCurrentSession().save(employee);
    }

    @Override
    @Transactional
    public List<Employee> listEmployee() {
        return sessionFactory.getCurrentSession().createQuery("from Employee").list();
    }

    @Override
    @Transactional
    public void removeEmployee(Integer id) {
        Employee employee = (Employee) sessionFactory.getCurrentSession().load(Employee.class, id);
        if (null != employee) {
            sessionFactory.getCurrentSession().delete(employee);
        }
    }

    @Override
    public Employee findById(Integer id) {
        return (Employee) sessionFactory.getCurrentSession().get(Employee.class, id);
    }

    @Override
    public void save(Employee employee) {
        sessionFactory.getCurrentSession().saveOrUpdate(employee);
    }
}
