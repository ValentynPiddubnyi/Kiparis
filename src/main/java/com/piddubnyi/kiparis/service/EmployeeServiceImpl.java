package com.piddubnyi.kiparis.service;

import com.piddubnyi.kiparis.dao.EmployeeDAO;
import com.piddubnyi.kiparis.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by fil on 4/15/14.
 */

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeDAO employeeDAO;

    @Override
    @Transactional
    public void addEmployee(Employee employee) {
        employeeDAO.addEmployee(employee);
    }

    @Override
    public List<Employee> listEmployee() {
        return employeeDAO.listEmployee();
    }

    @Override
    public void removeEmployee(Integer id) {
        employeeDAO.removeEmployee(id);
    }

    @Override
    @Transactional
    public void save(Employee employee) {
        employeeDAO.save(employee);
    }

    @Override
    @Transactional
    public Employee findById(Integer id) {
        return employeeDAO.findById(id);
    }
}
