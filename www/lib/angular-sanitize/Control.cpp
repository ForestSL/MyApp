#include"Control.h"
#include<algorithm>

#ifndef _CONTROL_H_
#define _CONTROL_H_

#include<vector>
#include<string>
#include<fstream>
#include<iostream>
#include<sstream>
#include"Choice.h"
#include"Course.h"

class Control
{
public:
	//学生管理
	void readStudentsInformation();
	void addStudentsInformation();
	void deleteStudentsInformation();
	void saveStudentsInformation();
	void sortStudentsByName();
	void sortStudentsByID();
	void printStudentsInformation();

	//课程管理
	void readCourseInformation();
	void addCourseInformation();
	void deleteCourseInformation();
	void saveCourseInformation();
	void printCourseInformation();

	//选课管理
	void chooseCourse();
	void quitCourse();
	void findStudentCourse();
	void findCourseStudents();

private:
	vector<Course> courses;
	vector<Choice> students;
};


#endif

void Control::printStudentsInformation()
{
	for (int i = 0; i < students.size(); i++)
	{
		cout << students[i].getName() << "  " << students[i].getId() << endl;
		students[i].inquirieCourse();
	}
}

void Control::printCourseInformation()
{
	for (int i = 0; i < courses.size(); i++)
	{
		cout << courses[i].getCourseName() << " " << courses[i].getCourseScore() << endl;
	}
}
void Control::readStudentsInformation()
{
	char *filename = "Students.txt";
	ifstream studentFile(filename);

	if (!studentFile.is_open())
	{
		cout << "学生信息文件没有被成功打开！" << endl;
		return;
	}

	while (!studentFile.eof())
	{
		char buffer[1000];
		studentFile.getline(buffer,1000);
		string studentsInfor= buffer;
		istringstream studentInformation(studentsInfor);
		
		Choice student = Choice();


		//读取学生姓名
		string name;
		studentInformation >> name;
		student.setName(name);
		//读取学生学号
		string id;
		studentInformation >> id;
		student.setId(id);
		string course;

		while (studentInformation >> course)
		{
			student.chooseCourse(course);
		}

		students.push_back(student);
	}
}

void Control::addStudentsInformation()
{
	Choice student;
	string name;
	string id;
	cout << "请输入学生姓名：";
	cin >> name;
	cout << "请输入学生学号：";
	cin >> id;
	//初始化新添加的学生信息
	student.setName(name);
	student.setId(id);
	//添加入存储数据结构
	students.push_back(student);
	cout << "添加成功！" << endl;
}

void Control::deleteStudentsInformation()
{
	cout << "请选择删除方式，输入1按学号删除，输入2按姓名删除：";
	int n;
	cin >> n;
	if (n == 1)
	{
		string id;
		cout << "请输入所要删除学生的学号：";
		cin >> id;
		for (int i = 0; i < students.size(); i++)
		{
			if (id == students[i].getId())
			{
				std::vector<Choice>::iterator it = students.begin() + i;
				students.erase(it);
			}
		}
	}
	else if (n == 2)
	{
		string name;
		cout << "请输入所要删除学生的姓名：";
		cin >> name;
		for (int i = 0; i < students.size(); i++)
		{
			if (name == students[i].getName())
			{
				std::vector<Choice>::iterator it = students.begin() + i;
				students.erase(it);
			}
		}
	}
	else
	{
		cout << "没有您选择的方式删除学生信息！"<<endl;
	}
}

void Control::saveStudentsInformation()
{
	ofstream studentFile("Students.txt");
	for (int i = 0; i < students.size(); i++)
	{
		studentFile << students[i].getName() << " " << students[i].getId() << students[i].courseNames();
		if (i != students.size() - 1)
			studentFile << endl;
	}
}

bool cmpId(Choice stu1, Choice stu2)
{
	return stu1.getId() < stu2.getId();
}


void Control::sortStudentsByID()
{
	sort(students.begin(), students.end(), cmpId);
}

bool cmpName(Choice stu1, Choice stu2)
{
	return (stu1.getName() < stu2.getName()) || (stu1.getName() == stu2.getName() && stu1.getId() < stu2.getId());
}

void Control::sortStudentsByName()
{
	sort(students.begin(), students.end(), cmpName);
}

void Control::readCourseInformation()
{
	char *filename = "Course.txt";
	ifstream courseInformation(filename);
	while (!courseInformation.eof())
	{
		char buffer[100];
		courseInformation.getline(buffer, 100, '\n');
		string courseInfor = buffer;
		istringstream course(courseInfor);

		Course cou;
		string courseName;
		course >> courseName;
		cou.setCourseName(courseName);
		int courseScore;
		course >> courseScore;
		cou.setCourseScore(courseScore);

		courses.push_back(cou);
		
	}
}

void Control::addCourseInformation()
{
	Course course;
	cout << "请输入课程名称（课程名称必须为连续字符串（如：程序设计基础），不准空格出现）：";
	string courseName;
	cin >> courseName;
	cout << "请输入课程学分（整形）：";
	int courseScore;
	cin >> courseScore;

	course.setCourseName(courseName);
	course.setCourseScore(courseScore);
	courses.push_back(course);
}

void Control::deleteCourseInformation()
{
	cout << "请输入你所要删除的课程名称：";
	string courseName;
	cin >> courseName;
	for (int i = 0; i < courses.size(); i++)
	{
		if (courses[i].getCourseName() == courseName)
		{
			std::vector<Course>::iterator it = courses.begin() + i;
			courses.erase(it);
		}
	}
}

void Control::saveCourseInformation()
{
	ofstream coursetFile("Course.txt");
	for (int i = 0; i < courses.size(); i++)
	{
		coursetFile << courses[i].getCourseName() << " " <<courses[i].getCourseScore()<< endl;
	}
}


void Control::chooseCourse()
{
	cout << "请输入你所要选课的学生姓名或学号：";
	string id;
	cin >> id;
	int i = 0;
	for (; i < students.size(); i++)
		if ((students[i].getId() == id) || (students[i].getName() == id))
		{
			string coursename;
			cout << "请输入课程名称：";
			cin >> coursename;
			students[i].chooseCourse(coursename);
			break;
		}
	if (i == students.size())
		cout << "没有您所要查找的学生的信息！" << endl;
}
void Control::quitCourse()
{
	cout << "请输入你所要选课的学生姓名或学号：";
	string id;
	cin >> id;
	int i = 0;
	for (; i < students.size(); i++)
		if ((students[i].getId() == id) || (students[i].getName() == id))
		{
			string coursename;
			cout << "请输入课程名称：";
			cin >> coursename;
			students[i].deleteCourse(coursename);
			break;
		}
	if (i == students.size())
		cout << "没有您所要查找的课程的信息！" << endl;
}
void Control::findStudentCourse()
{
	cout << "请输入你所要查找学生的学号或者姓名：";
	string id;
	cin >> id;
	int i = 0;
	for (; i < students.size();i++)
		if ((students[i].getId()== id)||(students[i].getName()==id))
		{
			int len = students[i].courseNames().length();
			cout << "所选课程如下：";
			cout << students[i].courseNames().substr(1,len-1) << endl;
			break;
		}
	if (i == students.size())
		cout << "没有您所要查找的学生的信息！" << endl;
}

void Control::findCourseStudents()
{
	string course;
	cout << "请输入你所要查询的课程名称：";
	cin >> course;
	cout << "选这门课的学生信息如下：" << endl;
	for (int i = 0; i < students.size();i++)
		if (students[i].hasThisCourse(course))
		{
			cout << students[i].getName() << " " << students[i].getId() << endl;
		}
}
