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
	//ѧ������
	void readStudentsInformation();
	void addStudentsInformation();
	void deleteStudentsInformation();
	void saveStudentsInformation();
	void sortStudentsByName();
	void sortStudentsByID();
	void printStudentsInformation();

	//�γ̹���
	void readCourseInformation();
	void addCourseInformation();
	void deleteCourseInformation();
	void saveCourseInformation();
	void printCourseInformation();

	//ѡ�ι���
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
		cout << "ѧ����Ϣ�ļ�û�б��ɹ��򿪣�" << endl;
		return;
	}

	while (!studentFile.eof())
	{
		char buffer[1000];
		studentFile.getline(buffer,1000);
		string studentsInfor= buffer;
		istringstream studentInformation(studentsInfor);
		
		Choice student = Choice();


		//��ȡѧ������
		string name;
		studentInformation >> name;
		student.setName(name);
		//��ȡѧ��ѧ��
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
	cout << "������ѧ��������";
	cin >> name;
	cout << "������ѧ��ѧ�ţ�";
	cin >> id;
	//��ʼ������ӵ�ѧ����Ϣ
	student.setName(name);
	student.setId(id);
	//�����洢���ݽṹ
	students.push_back(student);
	cout << "��ӳɹ���" << endl;
}

void Control::deleteStudentsInformation()
{
	cout << "��ѡ��ɾ����ʽ������1��ѧ��ɾ��������2������ɾ����";
	int n;
	cin >> n;
	if (n == 1)
	{
		string id;
		cout << "��������Ҫɾ��ѧ����ѧ�ţ�";
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
		cout << "��������Ҫɾ��ѧ����������";
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
		cout << "û����ѡ��ķ�ʽɾ��ѧ����Ϣ��"<<endl;
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
	cout << "������γ����ƣ��γ����Ʊ���Ϊ�����ַ������磺������ƻ���������׼�ո���֣���";
	string courseName;
	cin >> courseName;
	cout << "������γ�ѧ�֣����Σ���";
	int courseScore;
	cin >> courseScore;

	course.setCourseName(courseName);
	course.setCourseScore(courseScore);
	courses.push_back(course);
}

void Control::deleteCourseInformation()
{
	cout << "����������Ҫɾ���Ŀγ����ƣ�";
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
	cout << "����������Ҫѡ�ε�ѧ��������ѧ�ţ�";
	string id;
	cin >> id;
	int i = 0;
	for (; i < students.size(); i++)
		if ((students[i].getId() == id) || (students[i].getName() == id))
		{
			string coursename;
			cout << "������γ����ƣ�";
			cin >> coursename;
			students[i].chooseCourse(coursename);
			break;
		}
	if (i == students.size())
		cout << "û������Ҫ���ҵ�ѧ������Ϣ��" << endl;
}
void Control::quitCourse()
{
	cout << "����������Ҫѡ�ε�ѧ��������ѧ�ţ�";
	string id;
	cin >> id;
	int i = 0;
	for (; i < students.size(); i++)
		if ((students[i].getId() == id) || (students[i].getName() == id))
		{
			string coursename;
			cout << "������γ����ƣ�";
			cin >> coursename;
			students[i].deleteCourse(coursename);
			break;
		}
	if (i == students.size())
		cout << "û������Ҫ���ҵĿγ̵���Ϣ��" << endl;
}
void Control::findStudentCourse()
{
	cout << "����������Ҫ����ѧ����ѧ�Ż���������";
	string id;
	cin >> id;
	int i = 0;
	for (; i < students.size();i++)
		if ((students[i].getId()== id)||(students[i].getName()==id))
		{
			int len = students[i].courseNames().length();
			cout << "��ѡ�γ����£�";
			cout << students[i].courseNames().substr(1,len-1) << endl;
			break;
		}
	if (i == students.size())
		cout << "û������Ҫ���ҵ�ѧ������Ϣ��" << endl;
}

void Control::findCourseStudents()
{
	string course;
	cout << "����������Ҫ��ѯ�Ŀγ����ƣ�";
	cin >> course;
	cout << "ѡ���ſε�ѧ����Ϣ���£�" << endl;
	for (int i = 0; i < students.size();i++)
		if (students[i].hasThisCourse(course))
		{
			cout << students[i].getName() << " " << students[i].getId() << endl;
		}
}
