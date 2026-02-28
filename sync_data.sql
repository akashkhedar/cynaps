-- Sync data from backup to new database
-- Expertise Categories, Specializations, Billing Plans

-- Clear existing data first
DELETE FROM expertise_test_questions;
DELETE FROM expertise_test_question;
DELETE FROM expertise_test;
DELETE FROM expertise_specialization;
DELETE FROM expertise_category;
DELETE FROM billing_subscription;
DELETE FROM billing_subscription_plan;
DELETE FROM billing_credit_package;

-- Insert Expertise Categories (8 total)
INSERT INTO public.expertise_category VALUES (1, 'Computer Vision', 'computer-vision', 'Annotation tasks involving image and visual data analysis, including object detection, segmentation, and classification.', 'image', 'computer-vision', 0, true, '2026-02-06 03:29:44.167444+00', '2026-02-06 03:29:44.167461+00');
INSERT INTO public.expertise_category VALUES (2, 'Medical Imaging', 'medical-imaging', 'Specialized annotation for medical images including X-rays, CT scans, MRI, and pathology slides.', 'activity', 'medical-imaging', 1, true, '2026-02-06 03:29:44.222928+00', '2026-02-06 03:29:44.22294+00');
INSERT INTO public.expertise_category VALUES (3, 'Natural Language Processing', 'natural-language-processing', 'Text-based annotation tasks including entity recognition, sentiment analysis, and text classification.', 'file-text', 'natural-language-processing', 2, true, '2026-02-06 03:29:44.259109+00', '2026-02-06 03:29:44.259122+00');
INSERT INTO public.expertise_category VALUES (4, 'Audio/Speech Processing', 'audiospeech-processing', 'Audio annotation tasks including transcription, speaker diarization, and sound classification.', 'mic', 'audio-speech-processing', 3, true, '2026-02-06 03:29:44.294922+00', '2026-02-06 03:29:44.294934+00');
INSERT INTO public.expertise_category VALUES (5, 'Video Annotation', 'video-annotation', 'Video-based annotation tasks including object tracking, action recognition, and temporal segmentation.', 'video', 'videos', 4, true, '2026-02-06 03:29:44.322977+00', '2026-02-06 03:29:44.322988+00');
INSERT INTO public.expertise_category VALUES (6, 'Conversational AI', 'conversational-ai', 'Annotation for chatbot training, dialog classification, and conversation quality assessment.', 'message-circle', 'conversational-ai', 5, true, '2026-02-06 03:29:44.351664+00', '2026-02-06 03:29:44.351674+00');
INSERT INTO public.expertise_category VALUES (7, 'Generative AI', 'generative-ai', 'Annotation for evaluating and improving generative AI outputs including text, images, and code.', 'zap', 'generative-ai', 6, true, '2026-02-06 03:29:44.374321+00', '2026-02-06 03:29:44.374332+00');
INSERT INTO public.expertise_category VALUES (8, 'Structured Data Parsing', 'structured-data-parsing', 'Extracting structured information from documents, receipts, forms, and tables.', 'database', 'structured-data-parsing', 7, true, '2026-02-06 03:29:44.403647+00', '2026-02-06 03:29:44.403659+00');

-- Insert Expertise Specializations (33 total with rates)
INSERT INTO public.expertise_specialization VALUES (1, 'Object Detection', 'object-detection', 'Drawing bounding boxes around objects in images', 'target', 'object-detection-with-bounding-boxes', false, '', 10, 75, 0, true, NOW(), NOW(), 1);
INSERT INTO public.expertise_specialization VALUES (2, 'Image Classification', 'image-classification', 'Categorizing entire images into predefined classes', 'tag', 'image-classification', false, '', 10, 80, 1, true, NOW(), NOW(), 1);
INSERT INTO public.expertise_specialization VALUES (3, 'Semantic Segmentation', 'semantic-segmentation', 'Pixel-level labeling of image regions', 'layers', 'semantic-segmentation-with-masks', false, '', 10, 70, 2, true, NOW(), NOW(), 1);
INSERT INTO public.expertise_specialization VALUES (4, 'Image Captioning', 'image-captioning', 'Writing descriptive captions for images', 'message-square', 'image-captioning', false, '', 10, 75, 3, true, NOW(), NOW(), 1);
INSERT INTO public.expertise_specialization VALUES (5, 'OCR/Text Recognition', 'ocrtext-recognition', 'Transcribing text from images', 'type', 'optical-character-recognition', false, '', 10, 85, 4, true, NOW(), NOW(), 1);
INSERT INTO public.expertise_specialization VALUES (6, 'Keypoint Detection', 'keypoint-detection', 'Marking specific points of interest (e.g., body pose, facial landmarks)', 'crosshair', 'keypoints', false, '', 10, 75, 5, true, NOW(), NOW(), 1);
INSERT INTO public.expertise_specialization VALUES (7, 'Chest X-Ray Analysis', 'chest-x-ray-analysis', 'Annotating chest radiographs for lung conditions, cardiac abnormalities', 'heart', 'dicom-classification', true, 'Please upload proof of medical imaging certification or relevant healthcare background.', 10, 80, 0, true, NOW(), NOW(), 2);
INSERT INTO public.expertise_specialization VALUES (8, 'CT Scan Annotation', 'ct-scan-annotation', '3D annotation of computed tomography scans', 'circle', 'dicom-3d', true, '', 10, 80, 1, true, NOW(), NOW(), 2);
INSERT INTO public.expertise_specialization VALUES (9, 'MRI Segmentation', 'mri-segmentation', 'Segmenting anatomical structures in MRI scans', 'grid', 'dicom-segmentation', true, '', 10, 80, 2, true, NOW(), NOW(), 2);
INSERT INTO public.expertise_specialization VALUES (10, 'Pathology Slides', 'pathology-slides', 'Annotating histopathology and microscopy images', 'microscope', 'dicom-bbox', true, '', 10, 85, 3, true, NOW(), NOW(), 2);
INSERT INTO public.expertise_specialization VALUES (11, 'Dental Imaging', 'dental-imaging', 'X-ray annotation for dental conditions', 'smile', 'dicom-keypoint', false, '', 10, 80, 4, true, NOW(), NOW(), 2);
INSERT INTO public.expertise_specialization VALUES (12, 'Named Entity Recognition', 'named-entity-recognition', 'Identifying and categorizing entities (people, places, organizations) in text', 'user', 'named-entity-recognition', false, '', 10, 75, 0, true, NOW(), NOW(), 3);
INSERT INTO public.expertise_specialization VALUES (13, 'Sentiment Analysis', 'sentiment-analysis', 'Classifying text sentiment (positive, negative, neutral)', 'smile', 'sentiment-analysis', false, '', 10, 80, 1, true, NOW(), NOW(), 3);
INSERT INTO public.expertise_specialization VALUES (14, 'Text Classification', 'text-classification', 'Categorizing documents into predefined categories', 'folder', 'text-classification', false, '', 10, 75, 2, true, NOW(), NOW(), 3);
INSERT INTO public.expertise_specialization VALUES (15, 'Relation Extraction', 'relation-extraction', 'Identifying relationships between entities in text', 'link', 'relation-extraction', false, '', 10, 70, 3, true, NOW(), NOW(), 3);
INSERT INTO public.expertise_specialization VALUES (16, 'Machine Translation QA', 'machine-translation-qa', 'Evaluating and correcting machine translations', 'globe', 'translation-quality', false, '', 10, 80, 4, true, NOW(), NOW(), 3);
INSERT INTO public.expertise_specialization VALUES (17, 'Audio Transcription', 'audio-transcription', 'Transcribing spoken audio to text', 'headphones', 'audio-transcription', false, '', 10, 85, 0, true, NOW(), NOW(), 4);
INSERT INTO public.expertise_specialization VALUES (18, 'Speaker Diarization', 'speaker-diarization', 'Identifying and labeling different speakers in audio', 'users', 'speaker-identification', false, '', 10, 75, 1, true, NOW(), NOW(), 4);
INSERT INTO public.expertise_specialization VALUES (19, 'Sound Event Detection', 'sound-event-detection', 'Classifying and timestamping audio events', 'volume-2', 'sound-classification', false, '', 10, 70, 2, true, NOW(), NOW(), 4);
INSERT INTO public.expertise_specialization VALUES (20, 'Music Annotation', 'music-annotation', 'Labeling musical elements (instruments, genres, tempo)', 'music', 'music-annotation', false, '', 10, 75, 3, true, NOW(), NOW(), 4);
INSERT INTO public.expertise_specialization VALUES (21, 'Object Tracking', 'object-tracking', 'Tracking objects across video frames', 'crosshair', 'video-object-tracking', false, '', 10, 75, 0, true, NOW(), NOW(), 5);
INSERT INTO public.expertise_specialization VALUES (22, 'Action Recognition', 'action-recognition', 'Identifying and labeling human actions in video', 'activity', 'action-recognition', false, '', 10, 70, 1, true, NOW(), NOW(), 5);
INSERT INTO public.expertise_specialization VALUES (23, 'Temporal Segmentation', 'temporal-segmentation', 'Marking time boundaries for events in video', 'clock', 'video-segmentation', false, '', 10, 75, 2, true, NOW(), NOW(), 5);
INSERT INTO public.expertise_specialization VALUES (24, 'Video Captioning', 'video-captioning', 'Writing descriptions for video content', 'message-square', 'video-captioning', false, '', 10, 75, 3, true, NOW(), NOW(), 5);
INSERT INTO public.expertise_specialization VALUES (25, 'Intent Classification', 'intent-classification', 'Classifying user intents in conversational data', 'target', 'intent-classification', false, '', 10, 80, 0, true, NOW(), NOW(), 6);
INSERT INTO public.expertise_specialization VALUES (26, 'Dialog Act Tagging', 'dialog-act-tagging', 'Labeling dialog acts (questions, answers, commands)', 'tag', 'dialog-acts', false, '', 10, 75, 1, true, NOW(), NOW(), 6);
INSERT INTO public.expertise_specialization VALUES (27, 'Response Quality Rating', 'response-quality-rating', 'Rating chatbot response quality', 'star', 'response-rating', false, '', 10, 70, 2, true, NOW(), NOW(), 6);
INSERT INTO public.expertise_specialization VALUES (28, 'Text Generation QA', 'text-generation-qa', 'Evaluating generated text quality and factual accuracy', 'edit', 'text-generation-qa', false, '', 10, 80, 0, true, NOW(), NOW(), 7);
INSERT INTO public.expertise_specialization VALUES (29, 'Image Generation Rating', 'image-generation-rating', 'Rating quality and adherence to prompts for AI-generated images', 'image', 'image-generation-rating', false, '', 10, 75, 1, true, NOW(), NOW(), 7);
INSERT INTO public.expertise_specialization VALUES (30, 'Code Review', 'code-review', 'Evaluating AI-generated code for correctness and quality', 'code', 'code-review', false, '', 10, 85, 2, true, NOW(), NOW(), 7);
INSERT INTO public.expertise_specialization VALUES (31, 'RLHF Preference Ranking', 'rlhf-preference-ranking', 'Ranking multiple AI outputs for RLHF training', 'thumbs-up', 'preference-ranking', false, '', 10, 75, 3, true, NOW(), NOW(), 7);
INSERT INTO public.expertise_specialization VALUES (32, 'Document Parsing', 'document-parsing', 'Extracting structured data from documents', 'file-text', 'document-parsing', false, '', 10, 80, 0, true, NOW(), NOW(), 8);
INSERT INTO public.expertise_specialization VALUES (33, 'Receipt/Invoice Extraction', 'receiptinvoice-extraction', 'Parsing receipts and invoices for key fields', 'receipt', 'receipt-extraction', false, '', 10, 85, 1, true, NOW(), NOW(), 8);

-- Reset sequences
SELECT setval('expertise_category_id_seq', (SELECT MAX(id) FROM expertise_category));
SELECT setval('expertise_specialization_id_seq', (SELECT MAX(id) FROM expertise_specialization));

-- Insert Billing Subscription Plans (active ones)
INSERT INTO public.billing_subscription_plan VALUES (7, 'Starter Monthly', 'starter', 'monthly', 19999.00, 16000, 1.25, true, NOW(), NOW(), 10, NULL, true, true, true, 12, 0.00, 0, 0, '', 25.00, '[]', 10, 0.00, 0.00);
INSERT INTO public.billing_subscription_plan VALUES (8, 'Growth Monthly', 'growth', 'monthly', 49999.00, 43000, 1.16, true, NOW(), NOW(), 25, NULL, true, true, true, 12, 0.00, 0, 0, '', 19.00, '[]', 20, 0.00, 0.00);
INSERT INTO public.billing_subscription_plan VALUES (9, 'Scale Monthly', 'scale', 'monthly', 79999.00, 79999, 1.00, true, NOW(), NOW(), 50, NULL, true, true, true, 12, 0.00, 0, 0, '', 14.00, '[]', 30, 0.00, 0.00);
INSERT INTO public.billing_subscription_plan VALUES (2, 'Starter Annual', 'starter', 'annual', 199990.00, 18000, 0.93, true, NOW(), NOW(), 10, NULL, true, true, true, 12, 0.00, 0, 0, '', 25.00, '[]', 10, 0.00, 0.00);
INSERT INTO public.billing_subscription_plan VALUES (4, 'Growth Annual', 'growth', 'annual', 499990.00, 45000, 0.93, true, NOW(), NOW(), 25, NULL, true, true, true, 12, 0.00, 0, 0, '', 19.00, '[]', 20, 0.00, 0.00);
INSERT INTO public.billing_subscription_plan VALUES (6, 'Scale Annual', 'scale', 'annual', 799990.00, 81000, 0.82, true, NOW(), NOW(), 50, NULL, true, true, true, 12, 0.00, 0, 0, '', 14.00, '[]', 30, 0.00, 0.00);

-- Reset sequence
SELECT setval('billing_subscription_plan_id_seq', (SELECT MAX(id) FROM billing_subscription_plan));

-- Insert Credit Packages (PAYG - active ones)
INSERT INTO public.billing_credit_package VALUES (1, 'Explorer Package', 5000, 8750.00, 1.75, true, NOW());
INSERT INTO public.billing_credit_package VALUES (2, 'Professional Package', 25000, 37500.00, 1.50, true, NOW());
INSERT INTO public.billing_credit_package VALUES (3, 'Team Package', 100000, 135000.00, 1.35, true, NOW());
INSERT INTO public.billing_credit_package VALUES (4, 'Enterprise PAYG', 500000, 650000.00, 1.30, true, NOW());

-- Reset sequence
SELECT setval('billing_credit_package_id_seq', (SELECT MAX(id) FROM billing_credit_package));
