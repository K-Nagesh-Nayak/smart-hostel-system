import Notice from '../models/Notice.js';

// @desc    Get All Notices
// @route   GET /api/notices
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Post Notice (Admin only)
// @route   POST /api/notices
export const postNotice = async (req, res) => {
  const { title, content, priority } = req.body;
  try {
    const notice = await Notice.create({
      title,
      content,
      priority,
      postedBy: req.user._id
    });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Notice
// @route   DELETE /api/notices/:id
export const deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};