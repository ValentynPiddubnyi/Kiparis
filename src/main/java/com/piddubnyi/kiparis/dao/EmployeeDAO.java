package com.piddubnyi.kiparis.dao;

import com.piddubnyi.kiparis.model.Employee;

import java.util.List;

/**
 * Created by fil on 4/15/14.
 */
public interface EmployeeDAO {
    public void addEmployee(Employee employee);
    public List<Employee> listEmployee();
    public void removeEmployee(Integer id);
    public Employee findById(Integer id);
    public void save(Employee employee);
}
