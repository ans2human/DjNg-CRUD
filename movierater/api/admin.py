from django.contrib import admin

from movierater.api.models import Employee


@admin.register(Employee)

class EmployeeAdmin(admin.ModelAdmin):
    fields = ('name', 'mobileNo', 'position')
    list_display = ['name', 'mobileNo', 'position']
    search_fields = ('name', 'mobileNo', 'position')