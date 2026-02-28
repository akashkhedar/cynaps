"""
Comprehensive Task Assignment Algorithm Test Suite

Tests all scenarios:
1. 0 annotators assigned to project
2. 1 annotator (less than 2)
3. 2 annotators (exactly 2)
4. 3+ annotators (more than 2)
5. Expertise-based matching with no eligible annotators
6. Multiple annotators assigned same project but different tasks
7. Duplicate task assignments (same task to same annotator)
8. Scheduler/periodic check simulation

Usage: python manage.py test_assignment_algorithm

Generates detailed report at the end.
"""

import json
from datetime import datetime, timedelta
from collections import defaultdict
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import Count, Q, F
from django.db import transaction


class Command(BaseCommand):
    help = 'Comprehensive test of task assignment algorithm with detailed report'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.report = {
            'test_start': None,
            'test_end': None,
            'scenarios': [],
            'current_state': {},
            'issues_found': [],
            'recommendations': [],
        }

    def add_arguments(self, parser):
        parser.add_argument(
            '--project-id',
            type=int,
            help='Specific project ID to test. If not provided, tests first active project.',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Only analyze current state without running tests',
        )
        parser.add_argument(
            '--output',
            type=str,
            default='assignment_test_report.json',
            help='Output file for JSON report',
        )

    def handle(self, *args, **options):
        self.report['test_start'] = timezone.now().isoformat()

        self.stdout.write(self.style.HTTP_INFO('='*70))
        self.stdout.write(self.style.HTTP_INFO('TASK ASSIGNMENT ALGORITHM - COMPREHENSIVE TEST SUITE'))
        self.stdout.write(self.style.HTTP_INFO('='*70))
        self.stdout.write('')

        # Import models
        from projects.models import Project
        from tasks.models import Task
        from annotators.models import (
            AnnotatorProfile, ProjectAssignment, TaskAssignment,
            AnnotatorExpertise
        )
        from users.models import User

        # 1. Analyze Current State
        self.stdout.write(self.style.WARNING('\n📊 PHASE 1: ANALYZING CURRENT STATE'))
        self.stdout.write('-'*50)

        current_state = self._analyze_current_state()
        self.report['current_state'] = current_state

        # 2. Get test project
        project_id = options.get('project_id')
        if project_id:
            try:
                project = Project.objects.get(id=project_id)
            except Project.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Project {project_id} not found'))
                return
        else:
            project = Project.objects.filter(
                tasks__isnull=False
            ).annotate(
                task_count=Count('tasks')
            ).order_by('-task_count').first()
            
            if not project:
                self.stdout.write(self.style.ERROR('No projects with tasks found'))
                return

        self.stdout.write(f'\n🎯 Test Project: {project.id} - {project.title}')
        self.stdout.write(f'   Tasks: {project.tasks.count()}')

        # 3. Run Test Scenarios
        if not options.get('dry_run'):
            self.stdout.write(self.style.WARNING('\n📋 PHASE 2: RUNNING TEST SCENARIOS'))
            self.stdout.write('-'*50)

            # Test Scenario 1: 0 Annotators
            self._test_zero_annotators(project)

            # Test Scenario 2: 1 Annotator
            self._test_one_annotator(project)

            # Test Scenario 3: 2 Annotators
            self._test_two_annotators(project)

            # Test Scenario 4: 3+ Annotators
            self._test_three_plus_annotators(project)

            # Test Scenario 5: Expertise Matching
            self._test_expertise_matching(project)

        # 4. Check Assignment Distribution
        self.stdout.write(self.style.WARNING('\n📈 PHASE 3: ASSIGNMENT DISTRIBUTION ANALYSIS'))
        self.stdout.write('-'*50)
        self._analyze_assignment_distribution()

        # 5. Check for Issues
        self.stdout.write(self.style.WARNING('\n🔍 PHASE 4: ISSUE DETECTION'))
        self.stdout.write('-'*50)
        self._check_for_issues()

        # 6. Scheduler Check
        self.stdout.write(self.style.WARNING('\n⏰ PHASE 5: SCHEDULER CHECK'))
        self.stdout.write('-'*50)
        self._check_scheduler()

        # 7. Generate Final Report
        self.report['test_end'] = timezone.now().isoformat()
        self._generate_final_report(options.get('output'))

    def _analyze_current_state(self):
        """Analyze the current state of the system"""
        from projects.models import Project
        from tasks.models import Task
        from annotators.models import (
            AnnotatorProfile, ProjectAssignment, TaskAssignment
        )

        state = {}

        # Total counts
        state['total_projects'] = Project.objects.count()
        state['total_tasks'] = Task.objects.count()
        state['total_annotators'] = AnnotatorProfile.objects.count()
        state['total_assignments'] = TaskAssignment.objects.count()
        state['total_project_assignments'] = ProjectAssignment.objects.count()

        self.stdout.write(f'   Total Projects: {state["total_projects"]}')
        self.stdout.write(f'   Total Tasks: {state["total_tasks"]}')
        self.stdout.write(f'   Total Annotators: {state["total_annotators"]}')
        self.stdout.write(f'   Total Task Assignments: {state["total_assignments"]}')
        self.stdout.write(f'   Total Project Assignments: {state["total_project_assignments"]}')

        # Status breakdown
        state['assignment_status'] = dict(
            TaskAssignment.objects
            .values('status')
            .annotate(count=Count('id'))
            .values_list('status', 'count')
        )

        self.stdout.write('\n   Assignment Status Breakdown:')
        for status, count in state['assignment_status'].items():
            self.stdout.write(f'      {status}: {count}')

        # Approved annotators
        state['approved_annotators'] = AnnotatorProfile.objects.filter(
            status='approved'
        ).count()
        self.stdout.write(f'\n   Approved Annotators: {state["approved_annotators"]}')

        return state

    def _test_zero_annotators(self, project):
        """Test scenario: 0 annotators assigned to project"""
        from annotators.adaptive_assignment_engine import AdaptiveAssignmentEngine
        from annotators.models import ProjectAssignment

        self.stdout.write(self.style.NOTICE('\n🧪 Scenario 1: ZERO ANNOTATORS'))

        scenario = {
            'name': 'Zero Annotators',
            'description': 'Test assignment when no annotators are assigned to project',
            'test_time': timezone.now().isoformat(),
        }

        # Count current project assignments
        original_count = ProjectAssignment.objects.filter(project=project, active=True).count()

        # Temporarily disable all project assignments
        with transaction.atomic():
            # Create savepoint
            sid = transaction.savepoint()

            try:
                # Disable all assignments
                ProjectAssignment.objects.filter(project=project).update(active=False)

                # Calculate overlap with 0 annotators
                optimal_overlap, total_annotators, available = (
                    AdaptiveAssignmentEngine.calculate_optimal_overlap(project)
                )

                scenario['result'] = {
                    'total_annotators': total_annotators,
                    'available_annotators': available,
                    'calculated_overlap': optimal_overlap,
                    'expected_overlap': 1,  # Should default to 1
                }

                # Try running assignment
                result = AdaptiveAssignmentEngine.adaptive_assign_project_tasks(project)
                scenario['assignment_result'] = result

                if result.get('status') == 'no_annotators':
                    self.stdout.write(self.style.SUCCESS(
                        f'   ✓ Correctly handled: {result.get("message")}'
                    ))
                    scenario['passed'] = True
                else:
                    self.stdout.write(self.style.WARNING(
                        f'   ⚠ Unexpected result: {result}'
                    ))
                    scenario['passed'] = False

            finally:
                # Rollback to restore original state
                transaction.savepoint_rollback(sid)

        self.report['scenarios'].append(scenario)

    def _test_one_annotator(self, project):
        """Test scenario: 1 annotator (less than 2)"""
        from annotators.adaptive_assignment_engine import AdaptiveAssignmentEngine
        from annotators.models import ProjectAssignment, AnnotatorProfile
        from django.db.models.signals import post_save

        self.stdout.write(self.style.NOTICE('\n🧪 Scenario 2: ONE ANNOTATOR (< 2)'))

        scenario = {
            'name': 'One Annotator',
            'description': 'Test assignment with only 1 annotator assigned',
            'test_time': timezone.now().isoformat(),
        }

        # Get one approved annotator
        annotator = AnnotatorProfile.objects.filter(status='approved').first()
        if not annotator:
            scenario['skipped'] = True
            scenario['reason'] = 'No approved annotators available'
            self.stdout.write(self.style.WARNING('   ⚠ Skipped: No approved annotators'))
            self.report['scenarios'].append(scenario)
            return

        with transaction.atomic():
            sid = transaction.savepoint()

            try:
                # Temporarily disconnect the signal to avoid side effects
                from annotators.signals import auto_reassign_on_new_annotator
                post_save.disconnect(auto_reassign_on_new_annotator, sender=ProjectAssignment)
                
                # Disable all and enable only one
                ProjectAssignment.objects.filter(project=project).update(active=False)
                ProjectAssignment.objects.update_or_create(
                    project=project,
                    annotator=annotator,
                    defaults={'active': True}
                )

                # Calculate overlap
                optimal_overlap, total_annotators, available = (
                    AdaptiveAssignmentEngine.calculate_optimal_overlap(project)
                )

                scenario['result'] = {
                    'total_annotators': total_annotators,
                    'available_annotators': available,
                    'calculated_overlap': optimal_overlap,
                    'expected_overlap': 1,
                }

                if optimal_overlap == 1:
                    self.stdout.write(self.style.SUCCESS(
                        f'   ✓ Correct overlap: 1 (1 annotator → overlap=1)'
                    ))
                    scenario['passed'] = True
                else:
                    self.stdout.write(self.style.ERROR(
                        f'   ✗ Wrong overlap: {optimal_overlap} (expected 1)'
                    ))
                    scenario['passed'] = False

            finally:
                # Reconnect the signal
                try:
                    post_save.connect(auto_reassign_on_new_annotator, sender=ProjectAssignment)
                except Exception:
                    pass
                transaction.savepoint_rollback(sid)

        self.report['scenarios'].append(scenario)

    def _test_two_annotators(self, project):
        """Test scenario: 2 annotators"""
        from annotators.adaptive_assignment_engine import AdaptiveAssignmentEngine
        from annotators.models import ProjectAssignment, AnnotatorProfile
        from django.db.models.signals import post_save

        self.stdout.write(self.style.NOTICE('\n🧪 Scenario 3: TWO ANNOTATORS'))

        scenario = {
            'name': 'Two Annotators',
            'description': 'Test assignment with exactly 2 annotators',
            'test_time': timezone.now().isoformat(),
        }

        annotators = AnnotatorProfile.objects.filter(status='approved')[:2]
        if annotators.count() < 2:
            scenario['skipped'] = True
            scenario['reason'] = 'Less than 2 approved annotators available'
            self.stdout.write(self.style.WARNING('   ⚠ Skipped: Need at least 2 annotators'))
            self.report['scenarios'].append(scenario)
            return

        with transaction.atomic():
            sid = transaction.savepoint()

            try:
                # Temporarily disconnect the signal
                from annotators.signals import auto_reassign_on_new_annotator
                post_save.disconnect(auto_reassign_on_new_annotator, sender=ProjectAssignment)
                
                ProjectAssignment.objects.filter(project=project).update(active=False)
                for annotator in annotators:
                    ProjectAssignment.objects.update_or_create(
                        project=project,
                        annotator=annotator,
                        defaults={'active': True}
                    )

                optimal_overlap, total_annotators, available = (
                    AdaptiveAssignmentEngine.calculate_optimal_overlap(project)
                )

                scenario['result'] = {
                    'total_annotators': total_annotators,
                    'available_annotators': available,
                    'calculated_overlap': optimal_overlap,
                    'expected_overlap': 2,
                }

                if optimal_overlap == 2:
                    self.stdout.write(self.style.SUCCESS(
                        f'   ✓ Correct overlap: 2 (2 annotators → overlap=2)'
                    ))
                    scenario['passed'] = True
                else:
                    self.stdout.write(self.style.ERROR(
                        f'   ✗ Wrong overlap: {optimal_overlap} (expected 2)'
                    ))
                    scenario['passed'] = False

            finally:
                # Reconnect the signal
                try:
                    post_save.connect(auto_reassign_on_new_annotator, sender=ProjectAssignment)
                except Exception:
                    pass
                transaction.savepoint_rollback(sid)

        self.report['scenarios'].append(scenario)

    def _test_three_plus_annotators(self, project):
        """Test scenario: 3+ annotators"""
        from annotators.adaptive_assignment_engine import AdaptiveAssignmentEngine
        from annotators.models import ProjectAssignment, AnnotatorProfile
        from django.db.models.signals import post_save

        self.stdout.write(self.style.NOTICE('\n🧪 Scenario 4: THREE OR MORE ANNOTATORS'))

        scenario = {
            'name': 'Three+ Annotators',
            'description': 'Test assignment with 3+ annotators (maximum overlap)',
            'test_time': timezone.now().isoformat(),
        }

        annotators = AnnotatorProfile.objects.filter(status='approved')[:5]
        if annotators.count() < 3:
            scenario['skipped'] = True
            scenario['reason'] = 'Less than 3 approved annotators available'
            self.stdout.write(self.style.WARNING('   ⚠ Skipped: Need at least 3 annotators'))
            self.report['scenarios'].append(scenario)
            return

        with transaction.atomic():
            sid = transaction.savepoint()

            try:
                # Temporarily disconnect the signal
                from annotators.signals import auto_reassign_on_new_annotator
                post_save.disconnect(auto_reassign_on_new_annotator, sender=ProjectAssignment)
                
                ProjectAssignment.objects.filter(project=project).update(active=False)
                for annotator in annotators:
                    ProjectAssignment.objects.update_or_create(
                        project=project,
                        annotator=annotator,
                        defaults={'active': True}
                    )

                optimal_overlap, total_annotators, available = (
                    AdaptiveAssignmentEngine.calculate_optimal_overlap(project)
                )

                scenario['result'] = {
                    'total_annotators': total_annotators,
                    'available_annotators': available,
                    'calculated_overlap': optimal_overlap,
                    'expected_overlap': 3,
                }

                if optimal_overlap == 3:
                    self.stdout.write(self.style.SUCCESS(
                        f'   ✓ Correct overlap: 3 ({total_annotators} annotators → overlap=3)'
                    ))
                    scenario['passed'] = True
                else:
                    self.stdout.write(self.style.ERROR(
                        f'   ✗ Wrong overlap: {optimal_overlap} (expected 3)'
                    ))
                    scenario['passed'] = False

            finally:
                # Reconnect the signal
                try:
                    post_save.connect(auto_reassign_on_new_annotator, sender=ProjectAssignment)
                except Exception:
                    pass
                transaction.savepoint_rollback(sid)

        self.report['scenarios'].append(scenario)

    def _test_expertise_matching(self, project):
        """Test scenario: Expertise-based matching"""
        from annotators.models import AnnotatorExpertise, ExpertiseCategory

        self.stdout.write(self.style.NOTICE('\n🧪 Scenario 5: EXPERTISE MATCHING'))

        scenario = {
            'name': 'Expertise Matching',
            'description': 'Test expertise-based annotator matching',
            'test_time': timezone.now().isoformat(),
        }

        # Check expertise data
        categories = ExpertiseCategory.objects.filter(is_active=True)
        expertise_records = AnnotatorExpertise.objects.filter(status='verified')

        scenario['result'] = {
            'active_categories': categories.count(),
            'verified_expertise': expertise_records.count(),
            'categories': list(categories.values_list('name', flat=True)),
        }

        self.stdout.write(f'   Active Categories: {categories.count()}')
        self.stdout.write(f'   Verified Expertise Records: {expertise_records.count()}')

        if expertise_records.count() > 0:
            # Group by category
            by_category = expertise_records.values('category__name').annotate(
                count=Count('id')
            )
            self.stdout.write('   Expertise Distribution:')
            for item in by_category:
                self.stdout.write(f'      {item["category__name"]}: {item["count"]} annotators')
            scenario['expertise_distribution'] = list(by_category)
            scenario['passed'] = True
        else:
            self.stdout.write(self.style.WARNING(
                '   ⚠ No verified expertise records found'
            ))
            scenario['passed'] = False
            self.report['issues_found'].append({
                'severity': 'warning',
                'issue': 'No annotators have verified expertise badges',
                'recommendation': 'Have annotators complete skill tests to earn expertise badges'
            })

        self.report['scenarios'].append(scenario)

    def _analyze_assignment_distribution(self):
        """Analyze how tasks and projects are distributed among annotators"""
        from annotators.models import TaskAssignment, ProjectAssignment
        from django.db.models import F

        # 1. Check annotators per project
        project_annotators = (
            ProjectAssignment.objects
            .values('project_id', 'project__title')
            .filter(active=True)
            .annotate(annotator_count=Count('annotator'))
        )

        self.stdout.write('\n   📁 Annotators per Project:')
        for pa in project_annotators:
            self.stdout.write(
                f'      Project {pa["project_id"]}: {pa["annotator_count"]} annotators'
            )

        # 2. Check tasks per annotator
        annotator_tasks = (
            TaskAssignment.objects
            .values('annotator_id', 'annotator__user__email')
            .annotate(
                total_assigned=Count('id'),
                completed=Count('id', filter=Q(status='completed')),
                in_progress=Count('id', filter=Q(status='in_progress')),
                assigned=Count('id', filter=Q(status='assigned')),
            )
            .order_by('-total_assigned')[:10]
        )

        self.stdout.write('\n   👤 Tasks per Annotator (Top 10):')
        for at in annotator_tasks:
            self.stdout.write(
                f'      {at["annotator__user__email"]}: '
                f'{at["total_assigned"]} total '
                f'(✓{at["completed"]} / ⏳{at["in_progress"]} / 📋{at["assigned"]})'
            )

        self.report['current_state']['project_annotators'] = list(project_annotators)
        self.report['current_state']['annotator_tasks'] = list(annotator_tasks)

    def _check_for_issues(self):
        """Check for assignment issues and anomalies"""
        from annotators.models import TaskAssignment, ProjectAssignment
        from tasks.models import Task

        issues = []

        # Issue 1: Duplicate assignments (same task to same annotator)
        duplicates = (
            TaskAssignment.objects
            .values('task_id', 'annotator_id')
            .annotate(count=Count('id'))
            .filter(count__gt=1)
        )

        dup_count = duplicates.count()
        if dup_count > 0:
            issue = {
                'severity': 'critical',
                'issue': f'Found {dup_count} duplicate task assignments',
                'details': list(duplicates),
            }
            issues.append(issue)
            self.stdout.write(self.style.ERROR(
                f'   ✗ CRITICAL: {dup_count} duplicate task assignments found!'
            ))
        else:
            self.stdout.write(self.style.SUCCESS(
                '   ✓ No duplicate task assignments'
            ))

        # Issue 2: Tasks with more than 3 assignments
        over_assigned = (
            Task.objects
            .annotate(
                num_assignments=Count(
                    'annotator_assignments',
                    filter=Q(annotator_assignments__status__in=['assigned', 'in_progress', 'completed'])
                )
            )
            .filter(num_assignments__gt=3)
        )

        over_count = over_assigned.count()
        if over_count > 0:
            issue = {
                'severity': 'warning',
                'issue': f'Found {over_count} tasks with more than 3 assignments',
                'details': list(over_assigned.values('id', 'num_assignments')[:20]),
            }
            issues.append(issue)
            self.stdout.write(self.style.WARNING(
                f'   ⚠ WARNING: {over_count} tasks have more than 3 assignments'
            ))
        else:
            self.stdout.write(self.style.SUCCESS(
                '   ✓ No over-assigned tasks (max 3)'
            ))

        # Issue 3: Tasks with 0 assignments
        unassigned = Task.objects.annotate(
            num_assignments=Count('annotator_assignments')
        ).filter(num_assignments=0)

        unassigned_count = unassigned.count()
        if unassigned_count > 0:
            issue = {
                'severity': 'info',
                'issue': f'{unassigned_count} tasks have no assignments',
            }
            issues.append(issue)
            self.stdout.write(self.style.WARNING(
                f'   ⚠ INFO: {unassigned_count} tasks have no assignments'
            ))
        else:
            self.stdout.write(self.style.SUCCESS(
                '   ✓ All tasks have at least 1 assignment'
            ))

        # Issue 4: Annotators assigned to project but no tasks
        project_no_tasks = (
            ProjectAssignment.objects
            .filter(active=True)
            .annotate(
                task_count=Count(
                    'annotator__task_assignments',
                    filter=Q(annotator__task_assignments__task__project=F('project'))
                )
            )
            .filter(task_count=0)
        )

        pnt_count = project_no_tasks.count()
        if pnt_count > 0:
            details = list(
                project_no_tasks.values(
                    'annotator__user__email',
                    'project__title',
                    'project_id'
                )[:20]
            )
            issue = {
                'severity': 'warning',
                'issue': f'{pnt_count} annotators assigned to projects but have no tasks',
                'details': details,
            }
            issues.append(issue)
            self.stdout.write(self.style.WARNING(
                f'   ⚠ WARNING: {pnt_count} annotators assigned to projects but have 0 tasks'
            ))
            self.stdout.write('   Annotators with no tasks:')
            for item in details[:10]:
                self.stdout.write(
                    f'      - {item["annotator__user__email"]} → Project {item["project_id"]}'
                )
        else:
            self.stdout.write(self.style.SUCCESS(
                '   ✓ All project-assigned annotators have tasks'
            ))

        # Issue 5: Same task assigned to multiple annotators - This is EXPECTED
        multi_assigned = (
            Task.objects
            .annotate(
                num_assignments=Count('annotator_assignments', filter=Q(
                    annotator_assignments__status__in=['assigned', 'in_progress', 'completed']
                ))
            )
            .filter(num_assignments__gte=2)
        )

        multi_count = multi_assigned.count()
        self.stdout.write(self.style.SUCCESS(
            f'   ✓ {multi_count} tasks are assigned to multiple annotators (expected for overlap)'
        ))

        # Add to report
        self.report['issues_found'].extend(issues)

        # Summary of assignments by overlap
        overlap_summary = (
            Task.objects
            .annotate(
                overlap=Count('annotator_assignments', filter=Q(
                    annotator_assignments__status__in=['assigned', 'in_progress', 'completed']
                ))
            )
            .values('overlap')
            .annotate(count=Count('id'))
            .order_by('overlap')
        )

        self.stdout.write('\n   📊 Task Overlap Distribution:')
        for item in overlap_summary:
            self.stdout.write(f'      Overlap {item["overlap"]}: {item["count"]} tasks')

        self.report['current_state']['overlap_distribution'] = list(overlap_summary)

    def _check_scheduler(self):
        """Check scheduler configuration and provide guidance"""

        self.stdout.write('\n   ⏰ SCHEDULER INFORMATION')
        self.stdout.write('')
        
        # Check if we're on Windows
        import sys
        is_windows = sys.platform.startswith('win')

        if is_windows:
            self.stdout.write(self.style.WARNING(
                '   ⚠ Running on Windows - Background schedulers need manual setup'
            ))
            self.stdout.write('')
            self.stdout.write('   📋 OPTIONS FOR WINDOWS:')
            self.stdout.write('')
            self.stdout.write('   1. Manual periodic run (for testing):')
            self.stdout.write(self.style.SQL_COLTYPE(
                '      python manage.py process_assignment_timeouts'
            ))
            self.stdout.write('')
            self.stdout.write('   2. Windows Task Scheduler:')
            self.stdout.write('      - Open Task Scheduler → Create Basic Task')
            self.stdout.write('      - Trigger: Every hour or as needed')
            self.stdout.write('      - Action: Run python manage.py process_assignment_timeouts')
            self.stdout.write('')
            self.stdout.write('   3. PowerShell background job:')
            self.stdout.write(self.style.SQL_COLTYPE(
                '      while($true) { python manage.py process_assignment_timeouts; Start-Sleep -Seconds 3600 }'
            ))
        else:
            self.stdout.write(self.style.SUCCESS(
                '   ✓ Running on Linux/Mac - Cron can be used'
            ))
            self.stdout.write('')
            self.stdout.write('   Add to crontab (crontab -e):')
            self.stdout.write(self.style.SQL_COLTYPE(
                '   0 * * * * cd /path/to/cynaps && python manage.py process_assignment_timeouts'
            ))

        self.stdout.write('')
        self.stdout.write('   📦 IN PRODUCTION (Docker):')
        self.stdout.write('      The scheduler runs automatically in a container')
        self.stdout.write('      See: docker-compose.prod.yml → scheduler service')
        self.stdout.write('      It runs every hour automatically')

        self.report['scheduler'] = {
            'is_windows': is_windows,
            'production_mode': 'Automatic via Docker scheduler container',
            'development_mode': 'Manual or Windows Task Scheduler',
        }

    def _generate_final_report(self, output_file):
        """Generate the final comprehensive report"""

        self.stdout.write(self.style.WARNING('\n' + '='*70))
        self.stdout.write(self.style.WARNING('📋 FINAL REPORT SUMMARY'))
        self.stdout.write(self.style.WARNING('='*70))

        # Scenario Results
        passed = sum(1 for s in self.report['scenarios'] if s.get('passed', False))
        failed = sum(1 for s in self.report['scenarios'] if not s.get('passed', False) and not s.get('skipped', False))
        skipped = sum(1 for s in self.report['scenarios'] if s.get('skipped', False))

        self.stdout.write(f'\n   🧪 Test Scenarios: {passed} passed, {failed} failed, {skipped} skipped')

        for scenario in self.report['scenarios']:
            if scenario.get('skipped'):
                self.stdout.write(f'      ⏭️  {scenario["name"]}: SKIPPED - {scenario.get("reason", "")}')
            elif scenario.get('passed'):
                self.stdout.write(self.style.SUCCESS(f'      ✓ {scenario["name"]}: PASSED'))
            else:
                self.stdout.write(self.style.ERROR(f'      ✗ {scenario["name"]}: FAILED'))

        # Issues Summary
        critical = sum(1 for i in self.report['issues_found'] if i.get('severity') == 'critical')
        warnings = sum(1 for i in self.report['issues_found'] if i.get('severity') == 'warning')
        info = sum(1 for i in self.report['issues_found'] if i.get('severity') == 'info')

        self.stdout.write(f'\n   🔍 Issues Found: {critical} critical, {warnings} warnings, {info} info')

        if critical > 0:
            self.stdout.write(self.style.ERROR('\n   ⚠️  CRITICAL ISSUES:'))
            for issue in self.report['issues_found']:
                if issue.get('severity') == 'critical':
                    self.stdout.write(self.style.ERROR(f'      • {issue["issue"]}'))

        # Recommendations
        self.report['recommendations'] = []

        if self.report['current_state'].get('approved_annotators', 0) < 3:
            self.report['recommendations'].append(
                'Need at least 3 approved annotators for optimal 3-way overlap'
            )

        if critical > 0:
            self.report['recommendations'].append(
                'Fix critical issues (duplicate assignments) immediately'
            )

        expertise_scenario = next(
            (s for s in self.report['scenarios'] if s['name'] == 'Expertise Matching'),
            None
        )
        if expertise_scenario and not expertise_scenario.get('passed'):
            self.report['recommendations'].append(
                'Set up expertise categories and have annotators complete skill tests'
            )

        self.stdout.write('\n   💡 RECOMMENDATIONS:')
        for rec in self.report['recommendations']:
            self.stdout.write(f'      • {rec}')

        # Current State Summary
        self.stdout.write(f'\n   📊 CURRENT STATE:')
        state = self.report['current_state']
        self.stdout.write(f'      Total Projects: {state.get("total_projects", 0)}')
        self.stdout.write(f'      Total Tasks: {state.get("total_tasks", 0)}')
        self.stdout.write(f'      Total Annotators: {state.get("total_annotators", 0)}')
        self.stdout.write(f'      Approved Annotators: {state.get("approved_annotators", 0)}')
        self.stdout.write(f'      Total Task Assignments: {state.get("total_assignments", 0)}')

        # Save JSON report
        with open(output_file, 'w') as f:
            json.dump(self.report, f, indent=2, default=str)

        self.stdout.write(self.style.SUCCESS(f'\n   ✅ Full report saved to: {output_file}'))
        self.stdout.write('='*70)
