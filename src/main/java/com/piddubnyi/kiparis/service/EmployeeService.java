package com.piddubnyi.kiparis.service;

import com.piddubnyi.kiparis.model.Employee;

import java.util.List;

/**
 * Created by fil on 4/15/14.
 */
public interface EmployeeService {
    public void addEmployee(Employee employee);
    public List<Employee> listEmployee();
    public void removeEmployee(Integer id);
    public void save(Employee employee);
    public Employee findById(Integer id);
}
