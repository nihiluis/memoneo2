package logger

import "go.uber.org/zap"

// Logger wraps the actual logging library
// Unfinished design
type Logger struct {
	Zap *zap.SugaredLogger
}

// NewService creates a new Logger service
func NewService() *Logger {
	zap, _ := zap.NewDevelopment()
	sugar := zap.Sugar()

	logger := &Logger{Zap: sugar}

	return logger
}

// // Infof wraps zap infof
// func (l *Logger) Infof(template string, args ...interface{}) {
// 	l.Zap.Infof(template, args)
// }

// // Debugf wraps zap debugf
// func (l *Logger) Debugf(template string, args ...interface{}) {
// 	l.Zap.Debugf(template, args)
// }

// // Warnf wraps zap warnf
// func (l *Logger) Warnf(template string, args ...interface{}) {
// 	l.Zap.Warnf(template, args)
// }

// // Errorf wraps zap errorf
// func (l *Logger) Errorf(template string, args ...interface{}) {
// 	l.Zap.Errorf(template, args)
// }

// Info wraps zap info
func (l *Logger) Info(template string) {
	l.Zap.Infow(template)
}

// Debug wraps zap Debug
func (l *Logger) Debug(template string) {
	l.Zap.Debugw(template)
}

// Warn wraps zap Warn
func (l *Logger) Warn(template string) {
	l.Zap.Warnw(template)
}

// Error wraps zap error
func (l *Logger) Error(template string) {
	l.Zap.Errorw(template)
}

// Infow wraps zap infow
func (l *Logger) Infow(template string, args ...interface{}) {
	l.Zap.Infow(template, args)
}

// Debugw wraps zap Debugw
func (l *Logger) Debugw(template string, args ...interface{}) {
	l.Zap.Debugw(template, args)
}

// Warnw wraps zap Warnw
func (l *Logger) Warnw(template string, args ...interface{}) {
	l.Zap.Warnw(template, args)
}

// Errorw wraps zap errorw
func (l *Logger) Errorw(template string, args ...interface{}) {
	l.Zap.Errorw(template, args)
}
