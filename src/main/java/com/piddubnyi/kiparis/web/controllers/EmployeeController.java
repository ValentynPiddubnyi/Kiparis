package com.piddubnyi.kiparis.web.controllers;

import com.piddubnyi.kiparis.model.Employee;
import com.piddubnyi.kiparis.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by fil on 4/15/14.
 */
@Controller
@RequestMapping("/employees")
public class EmployeeController  {

    @Autowired
    EmployeeService employeeService;

    @RequestMapping(method = RequestMethod.GET)
    public String printEmployee(ModelMap modelMap, Principal principal) {

        String userName = principal.getName();
        List<Employee> employeesList = employeeService.listEmployee();
        modelMap.addAttribute("userName", userName);
        modelMap.addAttribute("employees", employeesList);
        return "employees";
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    public String editEmployee(@RequestParam String secondNameEdit, @RequestParam String firstNameEdit,
                               @RequestParam String thirdNameEdit, @RequestParam Integer idEdit,
                               @RequestParam @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dateEdit,
                               ModelMap modelMap){
        Employee employee = employeeService.findById(idEdit);
        employee.setSecondName(secondNameEdit);
        employee.setFirstName(firstNameEdit);
        employee.setThirdName(thirdNameEdit);
        employee.setBirthday(dateEdit);
        employeeService.save(employee);
        return "redirect:/employees";

    }

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(
                dateFormat, false));
    }
}
